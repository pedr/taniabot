const bot = require("./configs");
const cron = require("node-cron");
require("dotenv").config();

// const db = require('./database')

const { logMessages, echo, hxh, commands } = require("./src/generic");

const { saveYtbLink, getPlaylist } = require("./src/youtube");

const { getSynchLink, getSynchLivreLink } = require("./src/synch");

const { saveQuote, getQuote, rareScores } = require("./src/quotes");

const { generateValue, betResult } = require("./src/bets");

const { getRandomPhrase } = require("./src/wisdom");

const { getImgurImage } = require("./src/external-resources");

let chatList = [];

function onTextWrapper(textMatch, fn) {
  bot.onText(textMatch, async (...args) => {
    const [msg] = args;
    const chatId = msg.chat.id;

    if (!chatList.includes(chatId)) {
      chatList.push(chatId)
    }

    const response = await fn(...args);

    if (response) {
      bot.sendMessage(chatId, response);
    }
  });
}

cron.schedule("* 8 * * *", () => {
  for (let chatId of chatList) {
    getRandomPhrase().then(message => {
      bot.sendMessage(chatId, message)
    })
  }
})

cron.schedule("20 16 * * *", () => {
  for (let chatId of chatList) {
    getRandomPhrase().then(message => {
      bot.sendMessage(chatId, message)
    })
  }
})

cron.schedule("30 22 * * *", () => {
  for (let chatId of chatList) {
    getRandomPhrase().then(message => {
      bot.sendMessage(chatId, message)
      bot.sendMessage(chatId, "Boa noite.")
    })
  }
})


bot.on("message", logMessages);

// generic
onTextWrapper(/\/echo (.+)/, echo);
onTextWrapper(/\/hxh$/, hxh);
onTextWrapper(/\/cmds$/, commands);

// youtube
onTextWrapper(/\/ytb (.+)/, saveYtbLink);
onTextWrapper(/\/playlist$/, getPlaylist);

// synch
onTextWrapper(/\/synch$/, getSynchLink);
onTextWrapper(/\/synch_livre$/, getSynchLivreLink);

// quotes
onTextWrapper(/\/quote$/, saveQuote);
onTextWrapper(/\/quotes.*$/, getQuote);
onTextWrapper(/\/rare$/, rareScores);

// bets
onTextWrapper(/\/bet$/, generateValue);
onTextWrapper(/\/bet_result$/, betResult);

// external-resources
onTextWrapper(/\/meme/, getImgurImage);
