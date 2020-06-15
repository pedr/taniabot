function randomQuoteFromUser(messages, userId) {
  const filtered = messages.filter((m) => m.user == userId);

  if (!filtered.length) {
    return `usuario não possui nenhum quote memorável`;
  }

  const randomQuoteId = _randomIntFromInterval(0, filtered.length - 1);

  return formatQuote(filtered[randomQuoteId]);
}

function randomQuote(messages) {
  const randomQuoteId = _randomIntFromInterval(0, messages.length - 1);

  return formatQuote(messages[randomQuoteId]);
}

function formatQuote(message) {
  if (message === null) {
    return;
  }
  const { nick, quote, date, count } = message;
  const formatDate = new Date(date * 1000);
  const dateToString = `${formatDate.getDate()}/${
    formatDate.getMonth() + 1
  }/${formatDate.getFullYear()} ${formatDate.getHours()}:${formatDate.getMinutes()}`;
  return `“${quote}”
  \t\t\t\t\t\t${nick} - ${dateToString} - rarescale : ${count ? count : 0}
  `;
}

function _randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  randomQuoteFromUser,
  randomQuote,
  formatQuote,
};
