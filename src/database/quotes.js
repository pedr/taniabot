const { getDb } = require("../../database");

module.exports = {
  save: quote => {
    return getDb().then(db => {
      db.collection("quotes")
        .insert(quote)
        .then(r => {
          console.log(r);
        })
        .catch(err => {
          console.error(err);
        });
    });
  },

  getRandom: chatId => {
    return getDb().then(db => {
      return new Promise((resolve, reject) => {
        const cursor = db.collection("quotes").aggregate([
          {
            $match: {
              chatId: chatId
            }
          },
          {
            $sample: {
              size: 1
            }
          }
        ]);
  
        cursor.each((err, doc) => {
          if (err) {
            console.error(err)
            reject(err)
          } 
          resolve(doc)
        });
      })
    });
  },

  getRandomFromUser: (chatId, userId) => {
    return getDb().then(db => {
      return new Promise((resolve, reject) => {
        const cursor = db.collection("quotes").aggregate([
          {
            $match: {
              chatId: chatId,
              user: userId
            }
          },
          {
            $sample: {
              size: 1
            }
          }
        ]);
  
        cursor.each((err, doc) => {
          if (err) {
            console.error(err)
            reject(err)
          } 
          resolve(doc)
        });
      })
    });
  }
};
