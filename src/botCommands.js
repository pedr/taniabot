
const SimpleTextMatchWrapper = require("./utils/simpleTextMatchWrapper")
const messageForms = require("./utils/messageForms");

const { logMessages, echo, hxh, commands } = require("./generic");
const { saveYtbLink, getPlaylist } = require("./youtube");
const { getSynchLink, getSynchLivreLink } = require("./synch");
const { saveQuote, getQuote, rareScores, updateRating } = require("./quotes");
const { generateValue, betResult } = require("./bets");
const { getImgurImage } = require("./external-resources");
const { pictureOfTheDay } = require("./nasa");
const { unpromptedQuote } = require("./quotes/actions");

let chatList = [];

const botCommands = (bot, vault) => {
  const simpleTextMatchWrapper = SimpleTextMatchWrapper(chatList, bot);

  bot.on("message", logMessages);
  bot.on("message", async (msg) => {
    const response = await unpromptedQuote(msg);
    if (response && response.quote && response.id) {
      bot.sendMessage(msg.chat.id, response.quote)
    }
  });
  bot.on("callback_query", async (msg) => {
    const choice = msg.data;
  
    const parsed = JSON.parse(choice);
  
    switch (parsed.t) {
      case "rtg":
        await updateRating(parsed.quoteId, parsed.v, msg.from.id);
        break;
      default:
        break;
    }
    bot.sendMessage(msg.message.chat.id, `Obrigdo por participar da democracia, ${msg.from.first_name}`)
  });
  
  bot.onText(/\/quotes.*$/, async (msg) => {
    const chatId = msg.chat.id;
    const response = await getQuote(msg);
  
    if (response && response.quote && response.id) {
      bot.sendMessage(chatId, response.quote, messageForms.forRatings(response.id));
    }
  });
  
  // generic
  simpleTextMatchWrapper(/\/echo (.+)/, echo);
  simpleTextMatchWrapper(/\/hxh/, hxh);
  simpleTextMatchWrapper(/\/cmds/, commands);
  
  // youtube
  simpleTextMatchWrapper(/\/ytb (.+)/, saveYtbLink);
  simpleTextMatchWrapper(/\/playlist/, getPlaylist);
  
  // synch
  simpleTextMatchWrapper(/(\/synch_livre)+/, getSynchLivreLink);
  simpleTextMatchWrapper(/(\/synch[^_])/, getSynchLink);
  
  // quotes
  simpleTextMatchWrapper(/\/quote/, saveQuote);
  // simpleTextMatchWrapper(/\/quotes.*$/, getQuote);
  simpleTextMatchWrapper(/\/rare/, rareScores);
  
  // bets
  simpleTextMatchWrapper(/\/bet/, generateValue);
  simpleTextMatchWrapper(/\/bet_result/, betResult);
  
  // external-resources
  simpleTextMatchWrapper(/\/meme/, getImgurImage);
  simpleTextMatchWrapper(/\/nasa.*/, pictureOfTheDay);

  // secret

  simpleTextMatchWrapper(/\/secret/, (msg) => {
    const secret = vault.generateNew({ chatId: msg.chat.id });
    return `Esse link só vai funcionar uma vez, para gerar outro rode o comando /secret novamente, ${process.env.EXTERNAL_URL}page/${secret}`
  }, { disable_web_page_preview: true})
}


module.exports = botCommands;