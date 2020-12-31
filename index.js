const bot = require("./configs");
require("dotenv").config();

// const db = require('./database')

const { logMessages, echo, hxh, commands } = require("./src/generic");
const { saveYtbLink, getPlaylist } = require("./src/youtube");

const { getSynchLink, getSynchLivreLink } = require("./src/synch");

const { saveQuote, getQuote, rareScores, updateRating } = require("./src/quotes");

const { generateValue, betResult } = require("./src/bets");

// const { getRandomPhrase } = require("./src/wisdom");

const { getImgurImage } = require("./src/external-resources");

const { pictureOfTheDay } = require("./src/nasa");

let chatList = [];

function onTextWrapper(textMatch, fn) {
  bot.onText(textMatch, async (...args) => {
    const [msg] = args;
    const chatId = msg.chat.id;

    if (!chatList.includes(chatId)) {
      chatList.push(chatId);
    }

    const response = await fn(...args);

    if (response) {
      bot.sendMessage(chatId, response);
    }
  });
}

bot.on("message", logMessages);
bot.on("callback_query", async (msg) => {
  console.log(msg);

  const choice = msg.data;

  const parsed = JSON.parse(choice);
  console.log({parsed})

  switch (parsed.t) {
    case "rtg":
      await updateRating(parsed.quoteId, parsed.v, msg.from.id);
      break;
    default:
      break;
  }
  bot.sendMessage(chatId, "batblz")
});


bot.onText(/\/quotes.*$/, async (msg) => {
  console.log('aq')
  const chatId = msg.chat.id;

  if (!chatList.includes(chatId)) {
    chatList.push(chatId);
  }

  const response = await getQuote(msg);

  if (response && response.quote && response.id) {
    bot.sendMessage(chatId, response.quote, {
      reply_markup: {
        inline_keyboard: [
          [
            { 
              text: '👍',
              callback_data: JSON.stringify({ v: 1, quoteId: response.id, t: "rtg" })
            },
            { 
              text: '👎',
              callback_data: JSON.stringify({ v: -1, quoteId: response.id, t: 'rtg' })
            }
          ]
        ]
      }
    });
  }
});

// generic
onTextWrapper(/\/echo (.+)/, echo);
onTextWrapper(/\/hxh.+/, hxh);
onTextWrapper(/\/cmds/, commands);

// youtube
onTextWrapper(/\/ytb (.+)/, saveYtbLink);
onTextWrapper(/\/playlist/, getPlaylist);

// synch
onTextWrapper(/(\/synch_livre)+/, getSynchLivreLink);
onTextWrapper(/(\/synch[^_])/, getSynchLink);

// quotes
onTextWrapper(/\/quote/, saveQuote);
// onTextWrapper(/\/quotes.*$/, getQuote);
onTextWrapper(/\/rare/, rareScores);

// bets
onTextWrapper(/\/bet/, generateValue);
onTextWrapper(/\/bet_result/, betResult);

// external-resources
onTextWrapper(/\/meme/, getImgurImage);
onTextWrapper(/\/nasa.*/, pictureOfTheDay);
