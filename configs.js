require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api')
const express = require('express');


const token = process.env.TOKEN;
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const externalUrl = process.env.EXTERNAL_URL || "https://60dd4f94cd7c.ngrok.io";

if (process.env.stage == "DEV") {
    throw "ARRUMA O EXTERNALURL"
}

const app = express();
app.use(express.json());

let bot = new TelegramBot(token)
bot.setWebHook(`${externalUrl}/bot${token}`);

app.post(`/bot${token}`, (req, res) => {
    console.log('alo algo aconteceu')
    bot.processUpdate(req.body);
    res.sendStatus(200);
})

app.get("/", (req, res) => {
    res.send("<p>hello world</p>");
})

app.listen(port, () => {
    console.log(`server rodando na porta ${port}`);
})

module.exports = bot;
