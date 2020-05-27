# Telegram Lawyer Jokes Bot @lawyer_jokes_bot

<p align="center">
<img src="intro_demo.gif" width=300 height=620.61>
<img src="intro_demo_2.gif" width=300 height=620.61>
<img src="intro_demo_3.gif" width=300 height=620.61>
</p>

## Mission Statement
This is a Telegram bot to lighten up your day with witty, hilarious, and totally laughable lawyer jokes. Best for law students and humans.

## Features
The bot is shipped with a library of 101 lawyer jokes. End users can retrieve, search, index, and subscribe to these jokes. Users can also upload their own jokes for inclusion into the library, subject to administrator approval.  

The list of available commands on Telegram are: 

* /compose - create your own joke and share with everyone
* /get - retrieve a joke by its number
* /next - read the next joke in our list
* /search - find a joke that you liked
* /stats - info about your viewing history
* /subscribe - receive jokes periodically
* /unsubscribe - cancel an active subscription
* /top - get our top-rated jokes
* /reset - reset your viewing history

The bot uses [MongoDB](https://github.com/mongodb/mongo) as database. Admins can access a [mongo-express](https://github.com/mongo-express/mongo-express) administrator panel at `<your-host>:1999`. The HTTP Basic Authentication crediential is `ysong:<YOUR PASSWORD>`. Admins also receive emails at a customizable address whenever users submit new jokes. The format of the email is customizable through [pug](https://pugjs.org/api/getting-started.html) templates at `emails/contribution`. More on emails, see [email-templates](https://github.com/forwardemail/email-templates).

## Files

* `bot.js`: This file is the meat of this project. It contains the bot's logic. 
* `jokes.js`: This file is called to initialize the database. It contains a JSON of the 101 jokes.
* `Dockerfile`: Dockerizes the node environment. 
* `template.yml`: Templates to generate `docker-compose.yml`. Define your environmental variables. 
* `setup.sh`: Entrypoint of container.
* `package.json`
* `README.md`

## Setup 
The bot is fully containerized so getting it to run on your own machine should be relatively painless. Before starting
the containers, you need to customize the a few configurations. This project uses [dotenv](https://github.com/motdotla/dotenv)
to manage environmental variables, which provide settings such as API keys, database connection string, and email addresse. 

1. Define a `.env` file at the root of the project directory with the following content: 

    ```text
    DB_CONNECTION_STRING=<MONGODB CONNECTION STRING (default: mongodb://root:pass@mongo:27017)>
    POSTMARK_API_KEY=<YOUR POSTMARK API KEY>
    EMAIL_FROM=<BOT'S EMAIL ADDRESS (via Postmark)>
    EMAIL_TO=<YOUR EMAIL ADDRESS>
    TG_TOKEN=<YOUR TELEGRAM BOT TOKEN>
    ```

      if you are unsure where to obtain API keys, these guides are good starting points: [Postmark](https://postmarkapp.com/support/article/1002-getting-started-with-postmark)  [Telegram](https://core.telegram.org/bots)

2. Generate `docker-compose.yml` from `template.yml` using the command 
    ```bash
    export MONGO_EXPRESS_BASIC_AUTH_PASSWORD=<YOUR PASSWORD>
    rm -rf docker-compose.yml
    envsubst < "template.yml" > "docker-compose.yml"
    ```
3. Run `docker-compose up --build` in the root directory of the project to build the containers for the first time and start them.
4. Enjoy!
