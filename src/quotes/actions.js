const { randomQuoteFromUser, randomQuote, formatQuote } = require("./helpers");

const quotesDao = require("../database/quotes");

/*
const quotes = [
  { 
    chatId: number,
    quotes: [
      {
        user,
        nick,
        quote,
        date
      }
    ]
  }
]
*/
const quotes = [];

function saveQuote(msg) {
  const chatId = msg.chat.id;

  const { reply_to_message: reply } = msg;

  if (!reply) {
    return;
  }

  const quote = {
    user: reply.from.id,
    nick: reply.from.first_name,
    quote: reply.text,
    date: reply.date,
    chatId,
  };

  quotesDao.save(quote);
}

function getQuote(msg) {
  const chatId = msg.chat.id;

  const [_, ...rest] = msg.text.split(" ");

  let contentToFind = undefined;

  if (rest.length) {
    contentToFind = rest.join(" ");
  }

  const { reply_to_message: reply } = msg;

  const userId = reply ? (reply.from ? reply.from.id : undefined) : undefined;

  if (userId) {
    return quotesDao.getRandomFromUser(chatId, userId, contentToFind).then((quote) => {
      return formatQuote(quote);
    });
  }

  return quotesDao.getRandom(chatId, contentToFind).then((quote) => {
    return formatQuote(quote);
  });
}

module.exports = {
  getQuote,
  saveQuote,
};
