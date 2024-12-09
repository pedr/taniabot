require("dotenv").config();

const path = require('path');
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const token = process.env.TOKEN;
const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";
const externalUrl = process.env.EXTERNAL_URL;

const app = express();
app.use(express.json());

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

let bot = new TelegramBot(token);
bot.setWebHook(`${externalUrl}bot${token}`);

app.listen(port, () => {
  console.log("telegram webhook: " + `${externalUrl}bot${token}`);
  console.log(`server rodando na porta ${port}`);
});

module.exports = {
  app,
  bot,
};
