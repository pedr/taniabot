const phrasesDao = require("../database/phrase");

function getRandom() {
  return phrasesDao.getRandom().then((phrase) => {
    return `
     ${phrase.quoteText}
        - ${phrase.quoteAuthor}
    `;
  });
}

module.exports = {
  getRandomPhrase: getRandom,
};
