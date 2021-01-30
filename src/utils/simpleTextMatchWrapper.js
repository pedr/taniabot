
function simpleTextMatchWrapper(chatList, bot) {
  return (textMatch, fn, sendMessageOptions) => {
    bot.onText(textMatch, async (...args) => {
      const [msg] = args;
      const chatId = msg.chat.id;
  
      if (!chatList.includes(chatId)) {
        chatList.push(chatId);
      }
  
      const response = await fn(...args);
  
      if (response) {
        bot.sendMessage(chatId, response, sendMessageOptions ? sendMessageOptions : undefined);
      }
    });
  }
}

module.exports = simpleTextMatchWrapper;