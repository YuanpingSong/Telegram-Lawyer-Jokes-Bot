require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const Email = require('email-templates');
const nodemailer = require('nodemailer');
const postmarkTransport = require('nodemailer-postmark-transport');

const token = process.env.TG_TOKEN;

const bot = new TelegramBot(token, {polling: true});

const MongoClient = require('mongodb').MongoClient;

const url = process.env.DB_CONNECTION_STRING;
const dbName = 'tg_lawyers_joke_bot';

const subscriptions = {};

const transporter = nodemailer.createTransport(postmarkTransport({
    auth: {
        apiKey: process.env.POSTMARK_API_KEY
    }
}));

const email = new Email({
    message: {
        from: process.env.EMAIL_FROM
    }, 
    send: true, 
    transport: transporter
});

// restore subscriptions
(async () => {
    const client = await MongoClient.connect(url, {useNewUrlParser: true})
    const db = client.db(dbName);
        
    const active_subscriptions = (await db.collection('users').find({}).toArray()).filter(user => user.subscription);
    await client.close();

    const timeNow = new Date()
    active_subscriptions.forEach((user => {
        // To calculate intraday timedelta
        user.subscription.time.setYear(timeNow.getFullYear());
        user.subscription.time.setMonth(timeNow.getMonth());
        user.subscription.time.setDate(timeNow.getDate());

        let timeDelta = user.subscription.time - timeNow; 
        if (timeDelta < 0) {
            timeDelta += 24 * 60 * 60 * 1000;
        }
        console.log(`Timeout: ${timeDelta/1000/60/60} hours`);
        subscriptions[user.chatId] = {timeout: 
            setTimeout(() => {
                nextJoke(user.subscription.msg, undefined, user.id)
                subscriptions[user.chatId] = setInterval( () => { nextJoke(user.subscription.msg, undefined, user.id) }, 24 * 60 * 60 * 1000);
            }, timeDelta)};
    }))
    console.log(`restored ${active_subscriptions.length} subscriptions`);
    console.log(subscriptions);
})()

    
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const nickname = msg.chat.first_name || msg.chat.last_name || msg.chat.username || 'stranger';
    const welcomString = `Hi ${nickname}\\. I am the *Lawyer Jokes bot*\\. I can help you find, enjoy, share, and compose everything humorous about law and lawyers\\.\n` + 
                         '\n' + 
                         'Available commands:\n ' +
                         '\n' + 
                         '/compose \\- create your own joke and share with everyone\n' +
                         '/get \\- retrieve a joke by its number\n' +
                         '/next \\- read the next joke in our list\n' +
                         '/search \\- find a joke that you liked\n' + 
                         '/stats \\- info about your viewing history\n' + 
                         '/subscribe \\- receive jokes periodically\n' + 
                         '/unsubscribe \\- cancel an active subscription\n' +
                         '/top \\- get our top\\-rated jokes\n' +  
                         '/reset \\- reset your viewing history'

    const client = await MongoClient.connect(url, {useNewUrlParser: true})
                    .catch(err => { console.log(err); });
    const db = client.db(dbName);
    await db.collection('users').updateOne({
        id: msg.from.id
    }, 
    { $set: {
        ...msg.from, 
        cursor: 0, 
        ratings: {},
        subscription: undefined, 
        chatId: msg.chat.id
    }}, 
    {
        upsert: true
    });
    await client.close(); 

    await bot.sendMessage(chatId, welcomString, {parse_mode: "MarkdownV2"} );
});

async function compose(msg, _, user_id) {
    const chatId = msg.chat.id;
    const resp = await bot.sendMessage(chatId, 'Have something to share? Make your contribution now by replying to this message!');


    bot.onReplyToMessage(chatId, resp.message_id, async (msg) => {
        try {
            await email
            .send({
                template: 'contribution', 
                message: {
                    to: process.env.EMAIL_TO
                }, 
                locals: {
                    content: msg.text, 
                    contributor: msg.from.first_name || 'Stranger', 
                    contributor_id: user_id || msg.from.id
                }
            });
        } catch (err) {
            console.log(err);
        }
       

        await bot.sendMessage(msg.chat.id, 'Thank you for your contribution! The administrator has been notified. Your joke will be included in our library shortly if it makes the administrator laugh!')
    })
}

bot.onText(/\/compose/, compose);


bot.onText(/\/get\s*(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const client = await MongoClient.connect(url, {useNewUrlParser: true})
    const db = client.db(dbName);

    const joke = await db.collection('jokes').findOne({ id: Number(match[1])-1});

    if (!joke) {
        await bot.sendMessage(chatId, 'Sorry, the joke number is not valid.');
    } else {
        const responseString = `<b>Joke #${joke.id+1}</b>\n\n${joke.text}`;
        await bot.sendMessage(chatId, responseString, 
            { 
                parse_mode: "HTML", 
                reply_markup: {
                        "inline_keyboard": [[{text: 'Haha😀', callback_data: `+${joke.id}`}, {text: 'Meh😒', callback_data: `-${joke.id}`}]]
                } 
            });
    }
});

async function nextJoke(msg, match, userId) {
    const chatId = msg.chat.id;
    const client = await MongoClient.connect(url, {useNewUrlParser: true})
                    .catch(err => { console.log(err); });
    const db = client.db(dbName);
    const user = await db.collection('users').findOne({id: userId || msg.from.id});
    const joke = await db.collection('jokes').findOne({id: user.cursor});
    if (joke) {
        await db.collection('users').updateOne({id: user.id}, { $set: {cursor: user.cursor+1} })
        const responseString = `<b>Joke #${joke.id+1}</b>\n\n${joke.text}`;
        await bot.sendMessage(chatId, responseString, 
            { 
                parse_mode: "HTML", 
                reply_markup: {
                        "inline_keyboard": [[{text: 'Haha😀', callback_data: `+${joke.id}`}, {text: 'Meh😒', callback_data: `-${joke.id}`}]]
                } 
            });
    } else {
        const endReachedString = `<b>🎉🎉Congratulations!🎉🎉</b>\n\nYou have finished all jokes in our library. Now consider restarting from the begining or contributing your own?`;
        bot.sendMessage(chatId, endReachedString, 
            { parse_mode: "HTML", 
              reply_markup: {
                    "inline_keyboard": [[{text: 'Restart', callback_data: 'a'}, {text: 'Compose', callback_data: 'b'}]]
                }
            } );
    }
}

bot.onText(/\/next/, nextJoke);

bot.onText(/\/search\s*(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const client = await MongoClient.connect(url, {useNewUrlParser: true})
    const db = client.db(dbName);

    const res = await db.collection('jokes').find(
        { $text: 
            { 
                $search: match[1], 
                $caseSensitive: false 
            } 
        })
        .project({ score: { $meta: "textScore" } })
        .sort( { score: { $meta: "textScore" } } ).toArray();
    
    let resultsString = '<b> Search Results </b>\n\n';
    res.slice(0, 10).forEach((joke, index) => {
        resultsString += `<b> Joke #${joke.id+1} </b> - `
        const idx = joke.text.indexOf(match[1].split(' '));
        const endIdx = (idx + 30) < joke.text.length ? idx + 30 : joke.text.length;
        const startIdx = (endIdx - 50) >= 0 ? endIdx - 50 : 0;
        if (startIdx > 0) resultsString += '...';
        resultsString += joke.text.slice(startIdx, endIdx);
        if (endIdx < joke.text.length) resultsString += '...';
        resultsString += '\n\n';
    })

    await bot.sendMessage(chatId, resultsString, { parse_mode: 'HTML' });
});

bot.onText(/\/stats/, async (msg) => {
    const chatId = msg.chat.id;
    const client = await MongoClient.connect(url, {useNewUrlParser: true})
    const db = client.db(dbName);
    const user = await db.collection('users').findOne({id: msg.from.id});
    
    const nickname = msg.chat.first_name || msg.chat.last_name || msg.chat.username || 'stranger';
    const jokesCount = await db.collection('jokes').countDocuments();
    const ratingsCount = Object.keys(user.ratings).length;
    const posRatingsCount = Object.values(user.ratings).filter(r => r == 1).length;
    const statString = `<b>${nickname}</b>, you have viewed <b>${user.cursor}</b> out of <b>${jokesCount}</b> jokes. You gave out <b>${ratingsCount}</b> ratings, of which <b>${posRatingsCount}</b> were upvote(s) and <b>${ratingsCount-posRatingsCount}</b> were downvote(s)`;
    
    await bot.sendMessage(chatId, statString, { parse_mode: 'HTML' } );
});

bot.onText(/\/subscribe/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, 'Would you like to hear a joke at this time every day?', { reply_markup: {
        "inline_keyboard": [[{text: 'For Sure!', callback_data: 'e'}, {text: 'Lemme think', callback_data: 'f'}]]
    } });
});

bot.onText(/\/unsubscribe/, async (msg) => {
    const chatId = msg.chat.id;
    if (subscriptions[chatId]) {
        if (subscriptions[chatId].timeout) clearTimeout(subscriptions[chatId].timeout);
        else clearInterval(subscriptions[chatId].interval);
        const client = await MongoClient.connect(url, {useNewUrlParser: true})
        const db = client.db(dbName);
        delete subscriptions[chatId];
        await db.collection('users').updateOne( { id: msg.from.id }, { $set: { subscription: undefined }});
        await bot.sendMessage(chatId, 'Successfully unsubscribed from daily jokes.')
    } else {
        await bot.sendMessage(chatId, 'You do not have an active subscription');
    }
});

bot.onText(/\/top\s*([0-9]*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const client = await MongoClient.connect(url, {useNewUrlParser: true})
    const db = client.db(dbName);
    const jokes = await db.collection('jokes').find({});

    const n = Number(match[1]) || 10;
    
    const topTen = (await jokes.toArray()).sort((a, b) => ((a.upvotes - a.downvotes) - (b.upvotes - b.downvotes)) * 1000 + (b.id - a.id)).reverse().slice(0, n);
    
    let topTenString = '<b> Top Jokes </b>\n\n';
    topTen.forEach((joke, index) => {
        topTenString += `<b>${index+1} - Joke #${joke.id+1}</b>  `;
        topTenString += joke.text.substr(0, 30);
        if (joke.text.length > 30) topTenString += '...';
        topTenString += '\n'
        topTenString += `👍${joke.upvotes}   👎${joke.downvotes}\n\n`
    })
    
    await bot.sendMessage(chatId, topTenString, { parse_mode: 'HTML' } );
});

bot.onText(/\/reset/, async (msg, match) => {
    const chatId = msg.chat.id;
    const client = await MongoClient.connect(url, {useNewUrlParser: true})
    const db = client.db(dbName);

    await bot.sendMessage(chatId, 'All of your history will be deleted, including ratings. Do you confirm?', { reply_markup: {
        "inline_keyboard": [[{text: 'Confirm', callback_data: 'c'}, {text: 'Cancel', callback_data: 'd'}]]
    } });
});

bot.on("callback_query", async (query) => {
    const client = await MongoClient.connect(url, {useNewUrlParser: true})
    const db = client.db(dbName);
    
    switch (query.data[0]) {
        case 'b': 
            compose(query.message, undefined, query.from.id);
            break;
        
        case 'a': 
        case 'c':
            const ratings = (await db.collection('users').findOne({ id: query.from.id })).ratings;
            for (let [jokeId, rating] of Object.entries(ratings)) {
                if (rating == 1) {
                    const upvotes = await db.collection('jokes').findOne({ id: jokeId }).upvotes;
                    await db.collection('jokes').updateOne({ id: jokeId}, { $set: { upvotes: upvotes-1 }})
                } else {
                    const downvotes = await db.collection('jokes').findOne({ id: jokeId }).downvotes;
                    await db.collection('jokes').updateOne({ id: jokeId }, { $set: { downvotes: downvotes-1 }})
                }
            }
            await db.collection('users').updateOne({ id: query.message.chat.id }, { $set: { cursor: 0, ratings: {} } });
            await bot.deleteMessage(query.message.chat.id, query.message.message_id);
            await bot.sendMessage(query.message.chat.id, 'Your history has been reset succeessfully!');
            await bot.answerCallbackQuery(query.id, { text: 'Reset' });
            break;
        
        case 'd':
            
            await bot.deleteMessage(query.message.chat.id, query.message.message_id);
            await bot.answerCallbackQuery(query.id, { text: 'Canceled' });
            break;
        
        case 'e':
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1)
            await bot.sendMessage(query.message.chat.id, `Awesome! Your first installment will be ready on <b>${tomorrow.toString()}</b>`, { parse_mode: 'HTML' });
            await bot.answerCallbackQuery(query.id, { text: 'Scheduled' });
            await db.collection('users').updateOne( { id: query.from.id }, { $set: { subscription: {time: tomorrow, msg: query.message} }});
            subscriptions[query.message.chat.id] = { interval: setInterval( () => { nextJoke(query.message, undefined, query.from.id) }, 24 * 60 * 60 * 1000) };
            break;
        
        case 'f':
            await bot.sendMessage(query.message.chat.id, `No problem! Your can start a new subscription with /subscribe anytime.`, { parse_mode: 'HTML' });
            await bot.answerCallbackQuery(query.id, { text: '' });
            break;
        
        default: 
            const isUpVote = query.data[0] == '+';
            const jokeId = query.data.substr(1);
            
            const user = await db.collection('users').findOne({ id: query.from.id });
            const joke = await db.collection('jokes').findOne({ id: Number(jokeId) });
            const prevRating = user.ratings[jokeId];

            user.ratings[jokeId] = isUpVote ? 1 : -1;
            if (!prevRating) {
                if (isUpVote) joke.upvotes += 1; else joke.downvotes += 1;
            } else if (isUpVote && prevRating == -1) {
                joke.upvotes += 1; 
                joke.downvotes -= 1;
            } else if (!isUpVote && prevRating == 1) {
                joke.upvotes -= 1; 
                joke.downvotes += 1;
            }

            await db.collection('users').updateOne({id: user.id }, { $set: { ratings: user.ratings }});
            await db.collection('jokes').updateOne({id: joke.id }, { $set: { upvotes: joke.upvotes, downvotes: joke.downvotes }});
            
            const answerText = isUpVote ? 'Upvoted' : 'Downvoted';
            bot.answerCallbackQuery(query.id, { text: answerText});
    }
});

bot.on("polling_error", (err) => console.log(err));