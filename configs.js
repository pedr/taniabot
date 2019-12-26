require('dotenv').config()

const token = process.env.TOKEN;
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const externalUrl = process.env.EXTERNAL_URL;

const TelegramBot = require('node-telegram-bot-api')
let bot

if (process.env.STAGE == 'dev') {
    bot = new TelegramBot(token, { polling: true })
} else {
    bot = new TelegramBot(token, { webHook: { port : port, host : host } });
    
    bot.setWebHook(externalUrl + ':443/bot' + token);
}

module.exports = bot;
