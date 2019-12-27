
const {
  randomQuoteFromUser,
  randomQuote
} = require('./helpers')

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

  const { reply_to_message: reply } = msg

  if (!reply) {
    return
  }

  const quote = {
    user: reply.from.id,
    nick: reply.from.first_name,
    quote: reply.text,
    date: reply.date
  }

  let quotesFromChat = quotes.find(q => q.chatId == chatId)

  if (!quotesFromChat) {
    quotes.push({
      chatId,
      quotes: []
    })
    quotesFromChat = quotes[quotes.length - 1]
  }

  quotesFromChat.quotes.push(quote)
}

function getQuote(msg) {
  const chatId = msg.chat.id;

  let quotesFromChat = quotes.find(q => q.chatId == chatId)

  if (!quotesFromChat) {
    return
  }

  const { reply_to_message: reply } = msg

  if (!reply) {
    return randomQuote(quotesFromChat.quotes);
  } else {
    return randomQuoteFromUser(messages, userId);
  }
}

module.exports = {
  getQuote,
  saveQuote
}

