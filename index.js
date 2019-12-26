
require('dotenv').config()

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TOKEN;
const port = process.env.PORT || 443;
const host = process.env.HOST || '0.0.0.0';
const externalUrl = process.env.EXTERNAL_URL;

// Create a bot that uses 'polling' to fetch new updates
//const bot = new TelegramBot(token, { webHook: { port, host } });
//bot.setWebHook(externalUrl + ':443/bot' + token);
var TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(token, { webHook: { port : port, host : host } });

bot.setWebHook(externalUrl + ':443/bot' + token);

const PLAYLISTS = {};

bot.on('message', (msg) => {
  console.log(msg);
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/hxh$/, (msg, match) => {

  const chatId = msg.chat.id;

  const lastHxH = new Date('2018-11-26');
  const today = new Date();
  const milliSinceHxH = today - lastHxH;
  // that is what it takes to calculate on js milli, seconds, min, hours
  const daysSinceHxH = Math.ceil( milliSinceHxH / (1000 * 60 * 60 * 24));

  const neverForget = `sdds cap, ${daysSinceHxH} dias sem cap`;

  bot.sendMessage(chatId, neverForget);

});

bot.onText(/\/cmds$/, (msg, match) => {
  const commands = "/hxh, /synch, /synch_livre, /playlist";
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, commands);
})

bot.onText(/(https:\/\/www.youtube\.com\/watch\?v\=)|(https:\/\/youtu\.be\/)/,
  (msg, match) => {

    function newVideo(msg, match) {
      const startMatch = msg.text.indexOf(match[0]);
      const endMatch = startMatch + match[0].length;
      const fromIdToEndOfLine = msg.text.slice(endMatch);

      // if there is no '&' should only be left with id
      const realId = fromIdToEndOfLine.split('&')[0];

      return realId;
    }

    const chatId = msg.chat.id;
    const realId = newVideo(msg, match);

    if (!PLAYLISTS[chatId]) {
      PLAYLISTS[chatId] = {
	chatId,
	videos: [],
      }
    }


    PLAYLISTS[chatId].videos.push(realId);
  });

bot.onText(/\/playlist$/, (msg, match) => {

  const chatId = msg.chat.id;

  console.log(PLAYLISTS);

  if (!PLAYLISTS[chatId]) {
    return;
  }
  function playlist(playlist) {
    const startOfUrl = 'https://www.youtube.com/watch_videos?video_ids=';
    return startOfUrl + playlist.videos.join(',');
  }

  bot.sendMessage(chatId, playlist(PLAYLISTS[chatId]));
});

/*
bot.onText(/\/synch$/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'https://cytu.be/r/copao');
})

bot.onText(/\/synch_livre$/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'http://cytu.be/r/copao_democratico');
})
*/