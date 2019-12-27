
const bot = require('./configs');

require('dotenv').config()

const express = require('express');
const app = express();

//setting middleware
app.use(express.static('public')); //Serves resources from public folder


const server = app.listen(process.env.PORT);


// const db = require('./database')

const {
  logMessages,
  echo,
  hxh,
  commands
} = require('./src/generic')

const {
  saveYtbLink,
  getPlaylist
} = require('./src/youtube')

const {
  getSynchLink,
  getSynchLivreLink
} = require('./src/synch')

const {
  saveQuote,
  getQuote
} = require('./src/quotes')

const {
  generateValue,
  betResult
} = require('./src/bets')

const {
  getImgurImage
} = require('./src/external-resources')

function onTextWrapper(textMatch, fn) {
  bot.onText(textMatch, async (...args) => {
    const [msg] = args;
    const chatId = msg.chat.id;

    const response = await fn(...args)

    if (response) {
      bot.sendMessage(chatId, response)  
    }

  })
}

bot.on('message', logMessages);

// generic
onTextWrapper(/\/echo (.+)/, echo);
onTextWrapper(/\/hxh$/, hxh);
onTextWrapper(/\/cmds$/, commands);

// youtube
onTextWrapper(/\/ytb (.+)/, saveYtbLink);
onTextWrapper(/\/playlist$/, getPlaylist);

// synch
onTextWrapper(/\/synch$/, getSynchLink)
onTextWrapper(/\/synch_livre$/, getSynchLivreLink)

// quotes
onTextWrapper(/\/quote$/, saveQuote)
onTextWrapper(/\/quotes$/, getQuote)

// bets
onTextWrapper(/\/bet$/, generateValue)
onTextWrapper(/\/bet_result$/, betResult)

// external-resources
onTextWrapper(/\/meme/, getImgurImage)