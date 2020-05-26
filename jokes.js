require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = process.env.DB_CONNECTION_STRING;
const dbName = 'tg_lawyers_joke_bot';

const jokes = [ 
    {
        id: 0, 
        text: 'A man died and was taken to Hell. As he passed sulfurous pits and shrieking sinners, he saw a man he recognized as a lawyer snuggling up to a beautiful woman. “That’s unfair!” he cried. “I have to roast for all eternity, and that lawyer gets to spend it with a beautiful woman.” “Quiet!” barked the devil, “Who are you to question that woman’s punishment?”',
        upvotes: 0, 
        downvotes: 0
    }, 
    {
        id: 1, 
        text: 'A defendant who had pleaded not guilty saw the jury that had been empanelled and announced that he was changing his plea to guilty. When the judge asked why, the defendant pointed to the eight women and four men in the jury box. “When I pleaded not guilty/ I didn’t know women would be on the jury. Judge, I can’t fool even one woman, so I know I can’t fool eight of them.”',
        upvotes: 0, 
        downvotes: 0
    }, 
    {
        id: 2, 
        text: 'Three lawyers and three MBAs are traveling by train to a conference. At the station, the MBAs each buy tickets and watch as the three lawyers buy only a single ticket “How are three people going to travel on only one ticket?” asks an MBA.\n“Watch and you’ll see,” answers one of the lawyers. \nThey all board the train. The MBAs take their respective seats but all three lawyers cram into a restroom and close the door behind them. Shortly after the train departs, the conductor comes around collecting tickets. He knocks on the restroom door and says, “Ticket, please.” \nThe door opens just a crack and a single arm emerges with a ticket in hand. The conductor takes it and moves on. \nThe MBAs agreed it was quite a clever idea. So after the conference, the MBAs decide to copy the lawyers on the return trip and save some money. When they get to the station, they buy a single ticket for the return trip. To their astonishment, the lawyers don’t buy any tickets at all. \n“How are you going to travel without a ticket?” asked one perplexed MBA. \n“Watch and you’ll see,” answers a lawyer. \nWhen they board the train the three MBAs cram into a rest-room and the three lawyers cram into another one nearby. The train departs. \nShortly afterward, one of the lawyers leaves his restroom and walks over to the restroom where the MBAs are hiding. He knocks on the door and says, “Ticket, please.”',
        upvotes: 0, 
        downvotes: 0
    }, 
    {
        id: 3, 
        text: 'A woman and her little girl were visiting the grave of the little girl’s grandmother. On their way through the cemetery back to the car, the little girl asked, “Mommy, do they ever bury two people in the same grave?” \n“Of course not, dear,” replied the mother. “Why would you think that?” \n“The tombstone back there said, \‘Here lies a lawyer and an honest man.\’"',
        upvotes: 0, 
        downvotes: 0
    }, 
    {
        id: 4, 
        text: 'Satan was complaining bitterly to God, “You made the world so that it was not fair, and you made it so that most people would have to struggle every day, fight against their innate wishes and desires, and deal with all sorts of losses, grief, disasters, and catastrophes. Yet people worship and adore you. People fight, get arrested, and cheat each other, and I get blamed, even when it is not my fault. Sure, I’m evil, but give me a break. Can’t you do something to make them stop blaming me?” \nAnd so God created lawyers.',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 5, 
        text: 'A man sat down at a bar, looked into his shirt pocket, and ordered a double Scotch. A few minutes later, the man again peeked into his pocket and ordered another double. This routine was followed for some time, until after looking into his pocket, he told the bartender that he’d had enough. \nThe bartender said, “I’ve got to ask you—what’s with the pocket business?” \nThe man replied, “I have my lawyer’s picture in there. When he starts to look honest, I’ve had enough.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 6, 
        text: 'An investment counselor went out on her own. She was shrewd and diligent, so business kept coming in, and pretty soon she realized she needed an in-house counsel, so she began interviewing young lawyers. \n“As I’m sure you can understand,” she started off with one of the first applicants, “in a business like this, our personal integrity must be beyond question.” She leaned forward. “Mr. Anderson, are you an honest lawyer?” \n“Honest,” replied the applicant. “Let me tell you something about honesty. Why, I’m so honest that my father lent me twenty-five thousand dollars for my education and I paid back every penny the minute I tried my very first case.” \n“Impressive... And what sort of case was that?” The lawyer squirmed in his seat and stated, \n“My father sued me for the loan money.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 7, 
        text: 'A man walked into the local Chamber of Commerce of a small town, obviously desperate. Seeing a man at the counter, the stranger asks, “Is there a criminal attorney in town?” To which the man behind the counter immediately quipped, “Yeah, but we can’t prove it yet!”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 8, 
        text: 'Jury: A collection of people banded together for the purpose of deciding which side has hired the better lawyer.',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 9, 
        text: 'Two lawyers were walking along negotiating a case. "Look," said one, "let\'s be honest with each other." "Okay, you first," replied the other. That was the end of the discussion.',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 10, 
        text: 'A millionaire informs his attorney, "I want a stipulation in my Will that my wife is to inherit everyting, but only if she remarries within six months of my death." "Why such an odd stipulation?" asked the attorney. "Because I want someone to be sorry I died!" came the reply', 
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 11, 
        text: 'I broke a mirror the other day. That\'s seven years bad luck, but my lawyer thinks he can get me five',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 12, 
        text: 'A mobster was on trial, facing a possible life sentence, but his lawyer bribed a juror to hold out for a lesser charge. \nAfter hours of deliberation, the jury returned a verdict carrying a maximum of ten years in prison. \nAfterward, the lawyer approached the juror. “You had me so worried! When the jury was out so long, I was afraid you couldn’t pull it off.” \n“I was worried too!” answered the juror. “The others all wanted to acquit him!”', 
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 13, 
        text: 'A plane full of New York lawyers was heading for their annual Las Vegas Convention when it was hijacked. The plane was forced to land at Chicago’s O’Hare Airport, and the hijackers radioed to ground control with a huge list of demands. \nWhen asked what would happen if their demands weren’t met the hijacker spokesman stated, “If you don’t do exactly as we say, we will release one lawyer every single hour.”', 
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 14, 
        text: 'A lawyer on his deathbed called out to his wife. \nShe rushed in and said, “What is it, darling?” \nHe told her to run and get the Bible as fast as possible. \nBeing a religious woman, she thought this was a good idea. She ran and got it and prepared to read him his favorite verse or something of the sort. \nHe snatched it from her and began quickly scanning pages, his eyes darting right and left. \nThe wife became curious, and asked, “What are you doing, darling?” \n“I’m looking for loopholes!” he shouted.',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 15, 
        text: 'Q: “How many times have you committed suicide?’',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 16, 
        text: 'Q: “You were there until the time you left, is that true?', 
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 17, 
        text: 'Q: “How was your first marriage terminated?” \nA: “By death.” \nA: “And by whose death was it terminated?”', 
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 18, 
        text: 'Q: “Can you describe the individual?” \nA: “He was about medium height and had a beard.” \nQ: “Was this a male or a female?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 19, 
        text: 'Q: “Were you present when your picture was taken?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 20, 
        text: 'Q: “How far apart were the vehicles at the time of the collision?”', 
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 21, 
        text: 'Q: “Now doctor, isn’t it true that when a person dies in his sleep, in most cases he just passes quietly away and doesn’t know anything about it until the next morning?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 22, 
        text: 'Q: “What happened then?” \nA: He told me, he says, “I have to kill you because you can identify me.” \nQ: “Did he kill you?”', 
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 23, 
        text: 'Q: “The youngest son, the twenty-year-old, how old is he?”', 
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 24, 
        text:  'Q: “She had three children, right? \nA: “Yes.” \nQ: “How many were boys?” \nA: “None.” \nQ: “Were there any girls?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 25, 
        text: 'Q: Were you alone or by yourself?',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 26, 
        text: 'Q: “Were you present in court this morning when you were',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 27, 
        text: 'Q: “Did he kill you?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 28, 
        text: 'Q: “You say that the stairs went down to the basement?” \nA: “Yes.” \nQ: “And these stairs, did they go up also?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 29, 
        text: 'Q: “Now then, Mrs. Johnson, how was your first marriage terminated?” \nA: “By death.” \nQ: “And by whose death was it terminated?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 30, 
        text: 'Q: “Do you know how far pregnant you are now?” \nA: “I’ll be three months on March 12th.” \nQ: “Apparently then, the date of conception was around January 12th?” \nA: “Yes.”\nQ: “What were you doing at that time?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 31, 
        text: 'Q: “Do you have any children or anything of that kind?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 32, 
        text: 'Q: “Was that the same nose you broke as a child?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 33, 
        text: 'Q: “You don’t know what it was, and you didn’t know what it looked like, but can you describe it?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 34, 
        text: 'Q: “Are you married?” \nA: “No, I’m divorced.” \nQ: “And what did your husband do before you divorced him?” \nA: “A lot of things I didn’t know about.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 35, 
        text: 'Q: “Mrs. Jones, is your appearance this morning pursuant to a deposition notice which I sent to your attorney?” \nA: “No. This is how I dress when I go to work.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 36, 
        text: 'Q: “Now, you have investigated other murders, have you not, where there was a victim?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 37, 
        text: 'Q: “Doctor did you say he was shot in the woods?” \nA: “No, I said he was shot in the lumbar region.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 38, 
        text: 'Q: “Could you see him from where you were standing?” \nA: “I could see his head.” \nQ: “And where was his head?” \nA: “Just above his shoulders.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 39, 
        text: 'Q: “... any suggestions as to what prevented this from being a murder trial instead of an attempted murder trial?” \nA: “The victim lived.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 40, 
        text: 'Q: “Are you sexually active?”\nA: “No, I just lie there.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 41, 
        text: 'Q: “Are you qualified to give a urine sample?” \nA: “Yes, I have been since early childhood.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 42, 
        text: 'Q: “Have you lived in this town all your life?” \nA: “Not yet.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 43, 
        text: 'A Texas attorney, realizing he was on the verge of unleashing a stupid question, interrupted himself and said, “Your Honor, I’d like to strike the next question.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 44, 
        text: 'Q: Do you recall approximately the time that you examined that body of Mr. Huntington at St. Mary’s Hospital?\nA: It was in the evening. The autopsy started about 5:30 P.M. \nQ: And Mr. Huntington was dead at the time, is that correct? \nA: No, you idiot, he was sitting on the table wondering why I was performing an autopsy on him!',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 45, 
        text: 'A woman and her little girl were visiting the grave of the little girl’s grandmother. On their way through the cemetery back to the car, the little girl asked, “Mommy, do they ever bury two people in the same grave?” \n“Of course not, dear,” replied the mother. “Why would you think that?” \n“The tombstone back there said, \‘Here lies a lawyer and an honest man.\’"',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 46, 
        text: 'Isn’t it a shame how 99% of the lawyers give the whole profession a bad name.',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 47, 
        text: 'If a lawyer and an IRS agent were both drowning, and you could only save one of ﻿them … would you go to lunch or read the paper?',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 48, 
        text: 'A motorist was hauled before the judge for driving with expired license plates. The judge listened attentively while the motorist gave him a long, plausible explanation. The judge then said with great courtesy, “My dear sir, we are not blaming you—we’re just fining you.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 49, 
        text: 'One day in court, a lawyer fell into a heated argument with the presiding magistrate over a point of law. “You’ve been showing contempt for this court!” the judge finally ﻿exclaimed. “No, Your Honor,” the lawyer replied, “I’ve been trying to conceal it.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 50, 
        text: 'A new law clerk was asked to prepare a suggested opinion in an important case. After working on the assignment for some time, he proudly handed in a 23-page document. When he got it back, he found a terse comment in the judge’s handwriting on page 7: “Stop romancing—propose already.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 51, 
        text: 'The presiding judge of a court invited a newly elected judge over for dinner. During the meal, the new judge, a man named Thorn, couldn’t help noticing how attractive and shapely the presiding judge’s housekeeper was. Over the course of the evening he started to wonder if there was more between the presiding judge and the housekeeper than met the eye. Reading the new judge’s thoughts, the presiding judge volunteered, “I know what you must be thinking, but I assure you, my relationship with my housekeeper is purely a professional one.” \nAbout a week later the housekeeper came to the presiding judge and said, “Your Honor, ever since that new judge came to dinner, I’ve ﻿been unable to find that beautiful silver gravy ladle. You don’t suppose he took it, do you?” \nThe presiding judge said, “Well, I doubt it, but I’ll write him a letter just to be sure.” So he sat down and wrote: “Dear Judge Thorn, I’m not saying that you did take a gravy ladle from my house, and I’m not saying you didn’t take a gravy ladle. But the fact remains that one has been missing ever since you were here for dinner.” \nSeveral days later the presiding judge received a reply letter from Judge Thorn: “Dear Presiding Judge, I’m not saying that you do sleep with your housekeeper, and I’m not saying that you don’t sleep with your housekeeper. But the fact remains that if you were sleeping in your own bed, you would have found the gravy ladle by now.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 52, 
        text: 'There are two kinds of lawyers: those who know the law and those who know the judge.',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 53, 
        text: 'A judge, bored and frustrated by a lawyer’s tedious arguments, had made numerous rulings to speed the trial along. The attorney had bristled at the judge’s orders, and their tempers grew hot. Finally, frustrated with ﻿another repetition of arguments he had heard many times before, the judge pointed to his ear and said, “Counselor, you should be aware that at this point, what you are saying is just going in one ear and out the other.” “Your honor,” replied the lawyer, “That goes without saying. What is there to prevent it?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 54, 
        text: 'Prisoner: All I want is justice!\nJudge: I’d like to help you, but all I can give you is ten years. ',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 55, 
        text: 'I learned law so well, the day I graduated I sued the college, won the case, and got my tuition back. --- Fred Allen',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 56, 
        text: '“You seem to have more than the average share of intelligence for a man of your background,” sneered the lawyer at a witness on the stand. \n“If I wasn’t under oath, I’d return the compliment,” replied the witness. ',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 57, 
        text: 'As a lawyer woke up in the hospital after surgery he asked, “Why are all the blinds drawn in here?” The nurse answered, “There’s a fire across the street and we didn’t want you to think the operation had been a failure.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 58, 
        text: 'What’s the difference between a good lawyer and a bad lawyer? A bad lawyer might let a case drag on for several years. A good lawyer knows how to make it last even longer.',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 59, 
        text: 'A 50-year-old lawyer who had been practicing since he was 25 passed away and arrived at the Pearly Gates for judgment. The lawyer said to St. Peter, “There must be some mistake! I’m only 50 years old, that’s far too young to die.” St. Peter frowned and consulted his book. “That’s funny, when we add up your billing records, you should be at least 83 by now!”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 60, 
        text: 'Why does the bar association code of ethics prevent sex between lawyers and their clients? To prevent clients from being billed twice for essentially the same service.',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 61, 
        text: 'A man went to a lawyer and asked what his fee was. “$100 for three questions,” answered the lawyer. “Isn’t that a little steep?” said the man. “Yes,” said the lawyer. “Now, what’s your third question?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 62, 
        text: 'A young lawyer, defending a businessman in a lawsuit, feared he was losing the case and asked his senior partner if he should send a box of cigars to the judge to curry favor. The senior partner was horrified. “The judge is an honorable man,” he said, “If you do that, I guarantee you’ll lose the case!” Eventually, the judge ruled in the young lawyers favor. “Aren’t you glad you didn’t send those cigars?” the senior partner asked. “Oh, I did send them,” the younger lawyer replied. “I just enclosed my opponents business card with them.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 63, 
        text: 'A rabbi, a Hindu, and a lawyer are in a car that breaks down in the countryside one evening. They walk to a nearby farm and the farmer tells them it’s too late for a tow truck but he has only two extra beds and one of them will have to sleep in the barn. The Hindu says, “I’m humble, I’ll sleep in the barn.” But minutes later he returns and knocks on the door and says, “There is a cow in the barn. It’s against my beliefs to sleep in the same building as a cow.” So the rabbi says, “It’s okay, I’ll sleep in the barn.” But soon, he is back knocking on the door as well, saying, “There is a pig in the barn, and I cannot shelter in a building with a pig.” So the lawyer is forced to sleep in the barn. Shortly, there is another knock on the door and the farmer sighs and answers it. It’s the pig and the cow.”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 64, 
        text: 'One day, a man is walking along the beach and comes across an odd-looking bottle. Not being one to ignore tradition, he rubs it and, much to his surprise, a genie actually appears. "For releasing me from the bottle, I will grant you three wishes," says the genie.\nThe man is ecstatic. "But there\'s a catch," the genie continues. "What catch?" asks the man, eyeing the genie suspiciously. The genie replies, "For each of your wishes, every lawyer in the world will receive DOUBLE what you ask for." "Hey, I can live with that! No problem!" replies the elated man. \n"What is your first wish?" asks the genie. "Well, I\'ve always wanted a Ferrari!" POOF! A Ferrari appears in front of the man. "Now, every lawyer in the world has been given TWO Ferraris," says the genie. "What is your next wish?" "I could really use a million dollars," replies the man, and POOF! One million dollars appears at his feet. "Now every lawyer in the world is TWO million dollars richer," the genie reminds the man. "Well, that\'s OK, as long as I\'ve got MY million," replies the man. \n"And what is your final wish?" asks the genie. The man thinks long and hard, and finally says, "Well, you know, I\'ve always wanted to donate a kidney."',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 65, 
        text: 'Two law partners leave their office and go to lunch. In the middle of lunch the junior partner slaps his forehead. "Damn," he says. "I forgot to lock the office safe before we left." His partner replies " What are you worried about? We\'re both here."',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 66, 
        text: 't the height of a political corruption trial, the prosecuting attorney attacked a witness. "Isn\'t it true," he bellowed, "that you accepted five thousand dollars to compromise this case?" The witness stared out the window as though he hadn\'t hear the question. "Isn\'t it true that you accepted five thousand dollars to compromise this case?" the lawyer repeated. The witness still did not respond. Finally, the judge leaned over and said, "Sir, please answer the question." "Oh," the startled witness said, "I thought he was talking to you."',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 67, 
        text: 'A doctor and a lawyer in two cars collided on a country road. The lawyer, seeing that the doctor was a little shaken up, helped him from the car and offered him a drink from his hip flask. The doctor accepted and handed the flask back to the lawyer, who closed it and put it away. "Aren\'t you going to have a drink yourself?" asked the doctor. "Sure; after the police leave," replied the lawyer.',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 68, 
        text: 'Two lawyers walking through the woods spotted a vicious-looking bear. The first lawyer immediately opened his briefcase, pulled out a pair of sneakers and started putting them on. \nThe second lawyer looked at him and said, "You\'re crazy! You\'ll never be able to outrun that bear!"\n"I don\'t have to," the first lawyer calmly replied. "I only have to outrun you."',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 69, 
        text: 'An old man was on his death bed. He wanted badly to take all his money with him. He called his priest, his doctor and his lawyer to his bedside. "Here\'s $30,000 cash to be held by each you. I trust you to put this in my coffin when I die so I can take all my money with me." \nAt the funeral, each man put an envelope in the coffin. Riding away in a limousine, the priest suddenly broke into tears and confessed that he had only put $20,000 into the envelope because he needed $10,000 for a new baptistery. "Well, since we\'re confiding in each other," said the doctor, "I only put $10,000 in the envelope because we needed a new machine at the hospital which cost $20,000."\nThe lawyer was aghast. "I\'m ashamed of both of you," he exclaimed. "I want it known that when I put my envelope in that coffin, it held my personal check for the full $30,000."',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 70, 
        text: 'A lawyer got married to a woman who had previously been married twelve times. On their wedding night the settled into the bridal suite at their hotel and the bride said to her new groom, "Please promise to be gentle,...I am still a virgin."\nThis puzzled the groom, since after twelve marriages he thought that at least one of her husbands would have been able to perform. He asked his new bride to explain the phenomenon.\nThe bride responded...\nMy first husband was a Sales Representative who spent our entire marriage telling me, in grandiose terms, "It\'s gonna be great!"\nMy second husband was from Software Services; he was never quite sure how it was supposed to function, but he said he would send me documentation.\nMy third husband was from Field Service who constantly said that everything was diagnostically "okay," but he just couldn\'t get the system up.\nMy fourth husband was from Educational Services, and he simply said, "Those who can... do; those who can\'t... teach."\nMy fifth husband was from the Telemarketing Department who said that he had the orders, but he wasn\'t quite sure when he was going to be able to deliver.\nMy sixth husband was an Engineer. He told me that he understood the basic process but needed three years to research, implement, and design a new state-of-the-art method.\nMy seventh husband was from Finance And Administration. His comments were that he knew how, but he just wasn\'t sure whether or not it was his job.\nMy eighth husband was from Standards And Regulations and told me that he was up to the standards but that regulations said nothing about how to do it.\nMy ninth husband was a Marketing Manager. He said, "I know I have the product, I\'m just not sure how to position it!"\nMy tenth husband was a psychiatrist and all he ever wanted to do was talk about it.\nMy eleventh husband was a gynecologist and all he ever wanted to do was look at it.\nMy twelfth husband was a stamp collector and all he ever wanted to do was philatelate. .. God I miss him!\nSo now I have married a lawyer, I know I\'m finally going to get screwed.',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 71, 
        text: "Five surgeons were taking a coffee break and discussing their work.\nThe first said, \'I think accountants are the easiest to operate on; you open them up and everything inside is numbered.'\nThe second said, 'I think librarians are the easiest to operate on; you open them up and everything inside is in alphabetical order.'\nThe third said, 'I like to operate on electricians; you open them up and everything inside is color-coded.'\nThe fourth surgeon said, 'I like Engineers...they always understand when you have a few parts left over at the end...'\nThe fifth one said, 'I like to operate on lawyers; they're heartless, spineless, gutless, and their heads and their butts are interchangeable.",
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 72, 
        text: 'God decided to take the devil to court and settle their differences once and for all. When Satan heard this, he laughed and said, "And where do you think you\'re going to find a lawyer?"',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 73, 
        text: 'A guy walks into a post office one day to see a middle-aged, balding man standing at the counter methodically placing "Love" stamps on bright pink envelopes with hearts all over them. He then takes out a perfume bottle and starts spraying scent all over the envelopes.\nHis curiosity getting the better of him, he goes up to the balding man and asks him what he is doing. The man says "I\'m sending out 1,000 Valentine cards signed, \'Guess who?\'"\n"But why?" asks the man. \n"I\'m a divorce lawyer," the man replies.',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 74, 
        text: 'A housewife, an accountant and a lawyer were asked "How much is 2+2?" \nThe housewife replies: "Four!".\nThe accountant says: "I think it\'s either 3 or 4. Let me run those figures through my spreadsheet one more time."\nThe lawyer pulls the drapes, dims the lights and asks in a hushed voice, "How much do you want it to be?"',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 75, 
        text: 'Many years ago, a junior partner in a firm was sent to a far-away state to represent a long-term client accused of robbery. After days of trial, the case was won, the client acquitted and released. Excited about his success, the attorney telegraphed the firm: "Justice prevailed." The senior partner replied in haste: "Appeal immediately."',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 76, 
        text: 'The Godfather, accompanied by his attorney, walks into a room to meet with his accountant. The Godfather asks the accountant, "where\'s the three million bucks you embezzled from me?"\nThe accountant doesn\'t answer.\nThe Godfather asks again, "where\'s the three million bucks you embezzled from me?"\nThe attorney interrupts, "Sir, the man is a deaf-mute and cannot understand you, but I can interpret for you."\nThe Godfather says, "well, ask him where the @#!* money is."\nThe attorney, using sign language, asks the accountant where the three million dollars is.\nThe accountant signs back, "I don\'t know what you\'re talking about."\nThe attorney interprets to the Godfather, " He doesn\'t know what you\'re talking about "\nThe Godfather pulls out a pistol, puts it to the temple of the accountant, cocks the hammer and says, "Ask him again where the @#!* money is!"\nThe attorney signs to the accountant, "He wants to know where it is!"\nThe accountant signs back, "Okay! Okay! The money\'s hidden in a suitcase behind the shed in my backyard!"\nThe Godfather says, "Well, what did he say?"\nThe attorney interprets to the Godfather, "He says that you don\'t have the guts to pull the trigger."',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 77, 
        text: 'A very successful lawyer parked his brand-new Lexus in front of the office, ready to show it off to his colleagues. As he got out, a truck came along, too close to the curb, and completely tore off the driver\'s door of the Lexus. The counselor immediately grabbed his cell phone, dialed 911, and it wasn\'t more than 5 minutes before a policeman pulled up.\nBefore the cop had a chance to ask any questions, the lawyer started screaming hysterically. His Lexus, which he had just picked up the day before, was now completely ruined and would never be the same, no matter how the body shop tried to make it new again.\nAfter the lawyer finally wound down from his rant, the cop shook his head in disgust and disbelief. "I can\'t believe how materialistic you lawyers are," he said. "You are so focused on your possessions that you don\'t notice anything else."\n"How can you say such a thing?" asked the lawyer.\nThe cop replied, "Didn\'t you know that your left arm is missing from the elbow down? It must have been torn off when the truck hit you."\n"My God!" screamed the lawyer, "Where is my Rolex?"',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 78, 
        text: 'A Chinese doctor can\'t find a job in a hospital in the US, so he opens a clinic and puts a sign outside that reads "GET TREATMENT FOR $20 - IF NOT CURED GET BACK $100."\nAn American lawyer thinks this is a great opportunity to earn $100 and goes to the clinic.\nLawyer: "I have lost my sense of taste."\nChinese: "Nurse, bring medicine from box No. 22 and put 3 drops in patient\'s mouth."\nLawyer: "Ugh. this is kerosene."\nChinese: "Congrats, your sense of taste is restored. Give me $20."\nThe annoyed lawyer goes back after a few days to recover his money.\nLawyer: "I have lost my memory. I cannot remember anything."\nChinese: "Nurse, bring medicine from box no. 22 and put 3 drops in his mouth."\nLawyer (annoyed): "This is kerosene. You gave this to me last time for restoring my taste."\nChinese: "Congrats. You got your memory back. Give me $20."\nThe fuming lawyer pays him, and then comes back a week later determined to get back $100.\nLawyer: "My eyesight has become very weak I can\'t see at all."\nChinese: "Well, I don\'t have any medicine for that, so take this $100."\nLawyer (staring at the note): "But this is $20, not $100!!"\nChinese: "Congrats, your eyesight is restored. Give me $20"',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 79, 
        text: 'A man in an interrogation room says “I’m not saying a word without my lawyer present.”\nCop: You are the lawyer.\nLawyer: Exactly, so where’s my present?',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 80, 
        text: 'What do you call a priest that becomes a lawyer?\nA father in law',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 81, 
        text: 'On their way to get married, a young Catholic couple were involved in a fatal car accident. The couple found themselves sitting outside the Pearly Gat\nwaiting for St. Peter to process them into Heaven.\nWhile waiting they began to wonder; Could they possibly get married in Heaven?\nWhen St. Peter arrived they asked him if they could get married in Heaven.\nSt. Peter said, \'I don\'t know. This is the first time anyone has asked. Let me go find out,\' and he left.\nThe couple sat and waited for an answer.... for a couple of months.\nWhile they waited, they discussed the pros and cons. If they were allowed to get married in Heaven, should they get married, what with the eternal aspect \nit all?\nWhat if it doesn\'t work? Are we stuck in Heaven together forever?\'\nAnother month passed. St. Peter finally returned, looking somewhat bedraggled.\n“Yes,\' he informed the couple, \'You can get married in Heaven.\'\n\'Great!\' said the couple. \'But we were just wondering; what if things don\'t work out? Could we also get a divorce in Heaven?\'\nSt. Peter, red-faced with anger, slammed his clipboard on the ground.\n\'What\'s wrong?\' asked the frightened couple.\n\'OH, COME ON!!!\' St. Peter shouted. \'It took me 3 months to find a priest up here! Do you have ANY idea how long it\'ll take to find a lawyer?”',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 82, 
        text: 'A Polish man moved to the USA and married an American girl. Although his English was far from perfect, they got along very well. One day he rushed into a lawyer\'s office and asked him if he could arrange a divorce for him. The lawyer said that getting a divorce would depend on the circumstances, and this conversation ensued: "Have you any grounds?" Yes, an acre and half and nice little home. "No, I mean what is the foundation of this case?" It\'s made of concrete. "I don\' think you understand. Does either of you have a real grudge?" No, we have carport, and not need one. "I mean what are your relations like?" All my relations still in Poland . " Is there any infidelity in your marriage?" We have hi-fidelity stereo and good DVD player. "Does your wife beat you up?" No, I\'m always up before her each morning. "Is your wife a nagger?" No, she white. "Why do you want this divorce?" She going to kill me. "What makes you think that?" I got proof. "What kind of proof?" She going to poison me. She buy a bottle at drugstore and put on shelf in bathroom. I can read English pretty good, and it say: POLISH REMOVER',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 83, 
        text: 'A lawyer gets pulled over by a police officer.\nThe officer asks the lawyer "Do you know why I pulled you over?"\n"I haven\'t the foggiest idea," said the lawyer.\nThe officer replied, "You didn\'t make a full stop at the stop sign back there. You only slowed down."\nThe lawyer thinks for a few seconds then says, "If you can prove to me the difference between stopping and slowing down, I\'ll take full responsibilit\nOtherwise, you let me off with a warning. Sound fair?"\nThe officer ponders it shortly before nodding his head. "Sounds fair. Can you step out of the car please?"\nJust as the lawyer steps out and shuts the car door, the officer pulls out his baton and starts beating the lawyer. After a few swings, the officer say\n"Now, would you like me to stop or slow down?"',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 84, 
        text: 
`In court, the trucking company's lawyer was questioning Clyde. "Didn't you say, at the moment of the accident, 'I'm fine.'" asked the lawyer?
Clyde responded, "Well, I'll tell you what happened. I had just loaded my favorite mule, Bessie, into the..."
"I did not ask you for any details", the lawyer interrupted. "Just answer the question. Did you not say, at the scene of the accident, 'I'm fine?'"
Clyde said, "Well, I had just got Bessie into the trailer and I was driving down the road."
The lawyer interrupted again and said "Judge, I'm trying to establish the fact that, at the scene of the accident, this man told the highway patrolman on the scene that he was just fine. Now several weeks after the accident he is trying to sue my client. I believe he is a fraud. Please tell him to simply answer the question."
By this time the judge was fairly interested in Clyde's answer and said to the lawyer "I'd like to hear what he has to say about his favorite mule, Bessie."
Clyde thanked the judge and proceeded.
"Well as I was saying, I had just loaded Bessie, my favorite mule, into the trailer and was driving down the highway when this huge semi-truck and trailer ran the stop sign and smacked my truck right in the side. I was thrown into one ditch and Bessie was thrown into the other. I was hurting real bad and didn't want to move. However, I could hear old Bessie moaning and groaning. I knew she was in terrible shape just by her groans.
When the highway patrolman came on the scene he could hear Bessie moaning and groaning so he went over to her. After he looked at her and saw her near fatal condition, he took out his gun and shot her between the eyes.
Then the patrolman came across the road, gun still in hand, looked at me and said, 'how are you feeling?'
Now what the fuck would you say?"`,
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 85, 
        text: 
`The local charity realized that it had never received a donation from the city's most successful lawyer.
So a volunteer paid the lawyer a visit in his lavish office. The volunteer opened the meeting by saying, 'Our research shows that even though your annual income is over two million dollars, you don't give a penny to charity. Wouldn't you like to give something back to your community?.
The lawyer thinks for a minute and says, 'First, did your research also show you that my mother is dying after a long painful illness, and she has huge medical bills that are far beyond her ability to pay?'
Embarrassed, the rep mumbles, 'Uh... No, I didn't know that.'
'Secondly,' says the lawyer, 'did it show that my brother, a disabled Veteran, is blind and confined to a wheelchair and is unable to support his wife and six children?
The stricken rep begins to stammer an apology, but is cut off again
'Thirdly, did your research also show you that my sister's husband died in a dreadful car accident, leaving her penniless with a mortgage and three children, one of whom is disabled and another that has learning disabilities requiring an array of private tutors?'
The humiliated rep, completely beaten, says, 'I'm so sorry. I had no idea.
And the lawyer says, 'So, if I didn't give any money to them, what makes you think I'd give any to you?`,
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 86, 
        text: 
`This was actually said in court and taken from a transcript:
Lawyer: "Doctor, before you performed the autopsy, did you check for a pulse?"
Witness: "No."
Lawyer: "Did you check for blood pressure?"
Witness: "No."
Lawyer: "Did you check for breathing?"
Witness: "No."
Lawyer: "So, then it is possible that the patient was alive when you began the autopsy?"
Witness: "No."
Lawyer: "How can you be so sure, Doctor?"
Witness: "Because his brain was sitting on my desk in a jar."
Lawyer: "But could the patient have still been alive nevertheless?"
Witness: "Yes, it is possible that he could have been alive and practicing law somewhere."`,
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 87, 
        text: `A man went to his lawyer and told him, ‘My neighbour owes me £500 and he won’t pay up. What should I do?’ ‘Do you have any proof he owes you the money?’ asked the lawyer. ‘Nope,’ replied the man. ‘OK, then write him a letter asking him for the £1,000 he owed you,’ said the lawyer. ‘But it’s only £500,’ replied the man. ‘Precisely. That’s what he will reply and then you’ll have your proof!’`,
        upvotes: 0, 
        downvotes: 0
    },

    {
        id: 88, 
        text: '...was spotted on a billboard ad for the law office of Larry L. Archie: “Just because you did it doesn’t mean you’re guilty.”',
        upvotes: 0, 
        downvotes: 0
    },
    
    {
        id: 89, 
        text: 
`The attorney tells the accused, “I have some good news and some bad news.”

“What’s the bad news?” asks the accused.

“The bad news is, your blood is all over the crime scene, and the DNA tests prove you did it.”

“What’s the good news?”

“Your cholesterol is 130.”`,
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 90, 
        text: 'I work in a courthouse, so when I served jury duty, I knew most of the staff. As I sat with other prospective jurors listening to a woman drone on about how long the process was taking, a judge and two lawyers passed by, giving me a big hello. A minute later, a few maintenance workers did the same.\nThat set off the malcontent: "Just how long have you been serving jury duty?',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 91, 
        text: 'I was in juvenile court, prosecuting a teen suspected of burglary, when the judge asked everyone to stand and state his or her name and role for the court reporter. \n"Leah Rauch, deputy prosecutor," I said. \n"Linda Jones, probation officer."\n"Sam Clark, public defender."\n"John," said the teen who was on trial. "I’m the one who stole the truck."',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 92, 
        text: 'After I prosecuted a man for killing a bird out of season with his slingshot, the court clerk suggested setting up a date for him to return with both the money for the fine and proof of community service. "That way," she said innocently, "you can kill two birds with one stone."',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 93, 
        text: 'Arrested on a robbery charge, our law firm’s client denied the allegations. So when the victim pointed him out in a lineup as one of four men who had attacked him, our client reacted vociferously.\n"He’s lying!" he yelled. "There were only three of us."',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 94, 
        text: 'While prosecuting a robbery case, I conducted an interview with the arresting officer. My first question: "Did you see the defendant at the scene?"\n"Yes, from a block away," the officer answered.\n"Was the area well lit?"\n"No. It was pretty dark."\n"Then how could you identify the defendant?" I asked, concerned.\nLooking at me as if I were nuts, he answered, "I’d recognize my cousin anywhere."',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 95, 
        text: 'I am a deputy sheriff assigned to courthouse security. As part of my job, I explain court procedures to visitors. One day I was showing a group of ninth-graders around. Court was in recess and only the clerk and a young man in custody wearing handcuffs were in the courtroom. "This is where the judge sits," I began, pointing to the bench. "The lawyers sit at these tables. The court clerk sits over there. The court recorder, or stenographer, sits over here. Near the judge is the witness stand and over there is where the jury sits. As you can see," I finished, "there are a lot of people involved in making this system work."\nAt that point, the prisoner raised his cuffed hands and said, "Yeah, but I’m the one who makes it all happen."',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 96, 
        text: 'Sidewalks were treacherous after a heavy snowstorm blanketed the University of Idaho campus. Watching people slip and slide, I gingerly made my way to class.\nSuddenly I found myself on a clean, snow-free section of walkway. This is weird, I thought— until I noticed that it was directly in front of the College of Law building.',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 97, 
        text: 'The judge had not yet put in an appearance in the San Diego traffic court. When the bailiff entered the courtroom, he sensed the nervousness of the traffic offenders awaiting their ordeal.\n"Good morning, ladies and gentlemen," he said. "Welcome to ‘What’s My Fine?’"',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 98, 
        text: 'As a potential juror in an assault-and-battery case, I was sitting in a courtroom, answering questions from both sides. The assistant district attorney asked such questions as: Had I ever been mugged? Did I know the victim or the defendant?\nThe defence attorney took a different approach, however. "I see you are a teacher," he said. "What do you teach?"\n"English and theatre," I responded.\n"Then I guess I better watch my grammar," the defence attorney quipped.\n"No," I shot back. "You better watch your acting."\nWhen the laughter in the courtroom died down, I was excused from the case.',
        upvotes: 0, 
        downvotes: 0
    },
    {
        id: 99, 
        text: 'A defendant isn’t happy with how things are going in court, so he gives the judge a hard time. Judge: “Where do you work?” Defendant: “Here and there.” Judge: “What do you do for a living?” Defendant: “This and that.” Judge: “Take him away.” Defendant: “Wait; when will I get out?” Judge: “Sooner or later.”',
        upvotes: 0, 
        downvotes: 0
    },

    {
        id: 100, 
        text: `How many lawyer jokes are there, anyway? Only three. The rest are true stories.`,
        upvotes: 0, 
        downvotes: 0
    },
];

(async () => {
    const client = await MongoClient.connect(url, {useNewUrlParser: true})
    const db = client.db(dbName);
    const col = db.collection('jokes');
    if (await col.countDocuments() == 0) {
        const res = await col.insertMany(jokes);
        col.createIndex('id', {unique: true});
        col.createIndex({ text: 'text' });
        console.log(`insert ${res.result.n} documents, success ${res.result.ok}`);
    } else {
        console.log(`detected ${await col.countDocuments()} documents`);
    }
    await client.close();
})();
