const bets = [];
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
function generateValue(msg) {
  const chatId = msg.chat.id;

  let betsFromChat = bets.find((p) => p.chatId == chatId);

  if (!betsFromChat) {
    bets.push({
      chatId,
      bets: [],
    });
    betsFromChat = bets[bets.length - 1];
  }
  const user = msg.from.id;
  const nick = msg.from.first_name;

  const alreadyPlaying = betsFromChat.bets.find((b) => b.id == user);

  function _randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  if (!alreadyPlaying) {
    betsFromChat.bets.push({
      id: user,
      nick,
      value: _randomIntFromInterval(1, 10),
    });
    return "sua aposta foi gerada, digite /bet_result para ver os resultados";
  } else {
    return "você já possui uma aposta nessa rodada";
  }
}

function betResult(msg) {
  const chatId = msg.chat.id;

  const betsFromChat = bets.find((b) => b.chatId == chatId);

  if (!betsFromChat || (betsFromChat.bets ? betsFromChat.bets.length < 2 : true)) {
    return "espere outra pessoa rodar o /bet";
  }

  const orderedBets = betsFromChat.bets.sort((a, b) => {
    return b.value - a.value;
  });

  let message = `O resultado dessa rodada foi:`;
  for (let i = 0; i < orderedBets.length; i++) {
    const bet = orderedBets[i];
    message += `\n${i + 1} - ${bet.nick} - valor: ${bet.value}`;
  }
  betsFromChat.bets = [];
  return message;
}

module.exports = {
  generateValue,
  betResult,
};
