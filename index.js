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

const { pictureOfTheDay } = require('./src/nasa');

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
    getQuote({ chat: { id: chatId }})
      .then(msg => bot.sendMessage(chatId, msg))
  }
})

cron.schedule("20 16 * * *", () => {
  for (let chatId of chatList) {
    getQuote({ chat: { id: chatId }, text: '' })
      .then(msg => bot.sendMessage(chatId, msg))
  }
})

cron.schedule("* 22 * * *", () => {
  for (let chatId of chatList) {
    pictureOfTheDay({ chat: { id: chatId}})
      .then(msg => bot.sendMessage(chatId, msg))
  }
})

const options = [
  { text: 'olá', callback_data: 1 },
  { text: 'isso é', callback_data: 2 },
  { text: 'um teste', callback_data: 3 }
]

const inlineKeyboard = [
  [
    options[0]
  ],
  [
    options[1],
    options[2]
  ],
];

bot.onText(/\/tst$/, msg => {
  const chatId = msg.chat.id;

  console.log(chatId)

  bot.sendMessage(chatId, "olá vc", {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: inlineKeyboard
    },
  }).then(r => console.log(r))
})

bot.on("message", logMessages);
bot.on("callback_query", (msg) => {
  console.log(msg)
  const chatId = msg.message.chat.id

  const choice = msg.data;

  console.log({choice})

  let opt = options.find(e => e.callback_data == choice)
  console.log(opt)

  bot.sendMessage(chatId, opt.text)
})

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
onTextWrapper(/\/nasa.*/, pictureOfTheDay);
