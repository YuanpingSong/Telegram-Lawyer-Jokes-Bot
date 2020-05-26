# Telegram Lawyer Jokes Bot @lawyer_jokes_bot

![](intro_demo.gif)

## Mission Statement
This is a Telegram bot to lighten up your day with witty, hilarious, and totally laughable lawyer jokes. Best for law students and humans.

## Features
The list of available commands are: 

* /compose - create your own joke and share with everyone
* /get - retrieve a joke by its number
* /next - read the next joke in our list
* /search - find a joke that you liked
* /stats - info about your viewing history
* /subscribe - receive jokes periodically
* /unsubscribe - cancel an active subscription
* /top - get our top-rated jokes
* /reset - reset your viewing history

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
3. run `docker-compose up --build` in the root directory of the project to build the containers for the first time and start them.
