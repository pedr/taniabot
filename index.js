
const bot = require('./configs');

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
  const commands = "/hxh, /synch, /synch_livre, /playlist, /bet, /bet_result";
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


bot.onText(/\/synch$/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'https://cytu.be/r/copao');
})

bot.onText(/\/synch_livre$/, (msg, match) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'http://cytu.be/r/copao_democratico');
})

const bets = []
bot.onText(/\/bet$/, (msg, match) => {

  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const chatId = msg.chat.id;
  const user = msg.from.id
  const nick = msg.from.first_name;

  const alreadyPlaying = bets.find(p => p.id == user && p.chatId == chatId)

  if (!alreadyPlaying) {
    bets.push({
      id: user,
      nick,
      chatId,
      value: randomIntFromInterval(1, 10)  
    })
    bot.sendMessage(chatId, 'sua aposta foi gerada, digite /bet_result para ver os resultados');
  } else {
    bot.sendMessage(chatId, 'você já possui uma aposta nessa rodada')
  }
})

bot.onText(/\/bet_result$/, (msg, match) => {
  const chatId = msg.chat.id;

  const betsFromChat = bets.filter( b => b.chatId == chatId).sort((a, b) => {
    if (a.value > b.value) {
      return 1;
    }
    
    if (a.value < b.value) {
      return -1;
    }
    
    return 0;
  })

  if (betsFromChat.length < 2) {
    return bot.sendMessage(chatId, "espere outra pessoa rodar o /bet");
  }

  let message = `O resultado dessa rodada foi:`
  for (let i = 0; i < betsFromChat.length; i++) {
    const bet = betsFromChat[i]
    message += `\n${i + 1} - ${bet.nick} - valor: ${bet.value}`
  }
  return bot.sendMessage(chatId, message);
})