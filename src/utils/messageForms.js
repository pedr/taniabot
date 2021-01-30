const messageForms = {
  forRatings: (quoteId) => {
    return {
      reply_markup: {
        inline_keyboard: [
          [
            { 
              text: '👍',
              callback_data: JSON.stringify({ v: 1, quoteId: quoteId, t: "rtg" })
            },
            { 
              text: '👎',
              callback_data: JSON.stringify({ v: -1, quoteId: quoteId, t: 'rtg' })
            }
          ]
        ]
      }
    }
  }
}

module.exports = messageForms;