const { randomQuoteFromUser, randomQuote, formatQuote } = require("./helpers");

const quotesDao = require("../database/quotes");

const unpromptedMessagesThresholder = process.env.UNPROMPTED ? parseInt(process.env.UNPROMPTED, 10) : 100;

console.log('Unprompted message thresolder is: ', unpromptedMessagesThresholder)

const unpromptedMessagesCounter = {
  // [chatId]: messagesCounter
}

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
    count: 0,
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
      quotesDao.increaseCount(quote)
      return { quote: formatQuote(quote), id: quote._id, userId: quote.user };
    });
  }

  return quotesDao.getRandom(chatId, contentToFind).then((quote) => {
    let quoteId = quote._id;
    quotesDao.increaseCount(quote._id, quote)
    return { quote: formatQuote(quote), id: quoteId, userId: quote.user };
  });
}

function rareScores(msg) {
  const chatId = msg.chat.id;

  return quotesDao.rareScores(chatId).then(rareList => {
    newRareList = rareList.sort((a, b) => a._id > b._id ? 1 : -1)
    return formatRares(newRareList)
  })
}

const formatRares = (rareList) => {
  return rareList.reduce((response, rare) => {
    if (rare._id) {
      return response += `#${rare._id} ======== ${rare.count}\n`
    }
    return response += `#0 ======== ${rare.count}\n`;
  }, `Rare table 1.0\nQuotado / qnt posts\n`)
}

const updateRating = (quoteId, value, voterId) => {
  return quotesDao.updateRating(quoteId, value, voterId).then(r => {
    console.log('updatedRating', JSON.stringify(r));
  }).catch(err => console.error(err))
}

const unpromptedQuote = async (msg) => {
  const chatId = msg.chat.id;

  if (!unpromptedMessagesCounter[chatId]) {
    unpromptedMessagesCounter[chatId] = 1;
  } else {
    unpromptedMessagesCounter[chatId] += 1;
  }

  if (unpromptedMessagesCounter[chatId] < unpromptedMessagesThresholder) {
    return;
  }

  unpromptedMessagesCounter[chatId] = 0;

  let contentToFind = msg.text;

  const { reply_to_message: reply } = msg;

  const userId = reply ? (reply.from ? reply.from.id : undefined) : undefined;

  if (userId) {
    return quotesDao.getRandomFromUser(chatId, userId, contentToFind).then((quote) => {
      quotesDao.increaseCount(quote)
      return { quote: formatQuote(quote), id: quote._id, userId: quote.user };
    });
  }

  return quotesDao.getRandom(chatId, contentToFind).then((quote) => {
    let quoteId = quote._id;
    quotesDao.increaseCount(quote._id, quote)
    return { quote: formatQuote(quote), id: quoteId, userId: quote.user };
  });
}


module.exports = {
  getQuote,
  saveQuote,
  rareScores,
  updateRating,
  unpromptedQuote,
};
