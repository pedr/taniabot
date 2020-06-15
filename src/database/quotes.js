const { getDb, ObjectID } = require("../../database");

module.exports = {
  save: (quote) => {
    return getDb().then((db) => {
      db.collection("quotes")
        .insert(quote)
        .then((r) => {
          console.log(r);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  },

  getRandom: (chatId, contentToFind) => {
    let params = {
      chatId: chatId,
    };

    if (contentToFind !== undefined) {
      params = {
        ...params,
        quote: {
          $regex: new RegExp(contentToFind, "i"),
        },
      };
    }

    return getDb().then((db) => {
      return new Promise((resolve, reject) => {
        const cursor = db.collection("quotes").aggregate([
          {
            $match: {
              ...params,
            },
          },
          {
            $sample: {
              size: 1,
            },
          },
        ]);

        cursor.each((err, doc) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(doc);
        });
      });
    });
  },

  getRandomFromUser: (chatId, userId, contentToFind) => {
    let params = {
      chatId: chatId,
      user: userId,
    };

    if (contentToFind) {
      params = {
        ...params,
        quote: {
          $regex: new RegExp(contentToFind, "i"),
        },
      };
    }
    return getDb().then((db) => {
      return new Promise((resolve, reject) => {
        const cursor = db.collection("quotes").aggregate([
          {
            $match: {
              ...params,
            },
          },
          {
            $sample: {
              size: 1,
            },
          },
        ]);

        cursor.each((err, doc) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(doc);
        });
      });
    });
  },

  increaseCount: (id, quote) => {
    delete quote._id
    return getDb().then((db) => {
      db.collection("quotes")
        .update({_id: new ObjectID(id)}, { $set: {...quote, count: (quote.count ? quote.count + 1 : 1) }})
        .then((r) => {
          console.log(r);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
};
