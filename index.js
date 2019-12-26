
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
  const commands = "/hxh, /synch, /synch_livre, /playlist, /bet, /bet_result, /ytb [link]";
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, commands);
})

bot.onText(/\/ytb (.+)/,
  (msg, match) => {

    function newVideo(input) {
      const ytbRegex = new RegExp(/([A-Z])\w+/);
      const realId = input.match(ytbRegex);

      return realId[0];
    }

    const chatId = msg.chat.id;
    const realId = newVideo(match[0]);

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
// bets = [
//  { chatId: 10,
//    bets: [
//      {
//        id,
//        nick,
//        value
//      }
//    ]
//  }
//]
bot.onText(/\/bet$/, (msg, match) => {

  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const chatId = msg.chat.id;

  let betsFromChat = bets.find(p => p.chatId == chatId)

  if (!betsFromChat) {
    bets.push({
      chatId,
      bets: []
    })
    betsFromChat = bets[bets.length - 1]
  }
  const user = msg.from.id
  const nick = msg.from.first_name;

  const alreadyPlaying = betsFromChat.bets.find(b => b.id == user)

  if (!alreadyPlaying) {
    betsFromChat.bets.push({
      id: user,
      nick,
      value: randomIntFromInterval(1, 10)  
    })
    bot.sendMessage(chatId, 'sua aposta foi gerada, digite /bet_result para ver os resultados');
  } else {
    bot.sendMessage(chatId, 'você já possui uma aposta nessa rodada')
  }
})

bot.onText(/\/bet_result$/, (msg, match) => {
  const chatId = msg.chat.id;

  const betsFromChat = bets.find( b => b.chatId == chatId);

  if (!betsFromChat || (betsFromChat.bets ? betsFromChat.bets.length < 2 : true)) {
    return bot.sendMessage(chatId, "espere outra pessoa rodar o /bet");
  }

  const orderedBets = betsFromChat.bets
    .sort((a, b) => {
      return b.value - a.value 
    })

  let message = `O resultado dessa rodada foi:`
  for (let i = 0; i < orderedBets.length; i++) {
    const bet = orderedBets[i]
    message += `\n${i + 1} - ${bet.nick} - valor: ${bet.value}`
  }
  betsFromChat.bets = []
  return bot.sendMessage(chatId, message);
})