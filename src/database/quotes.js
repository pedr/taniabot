const { getDb, ObjectID } = require("../database");

module.exports = {
  save: (quote) => {
    return getDb().then((db) => {
      db.collection("quotes")
        .insertOne(quote)
        .then((r) => {
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

	      cursor.next().then(doc => {
		     resolve(doc);
	      }).catch(err => {
		      console.error(err);
		      reject(err);
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

  getAllFromChat: (chatId) => {
    let params = {
      chatId: chatId,
    };

    return getDb().then((db) => {
      return new Promise((resolve, reject) => {
        const cursor = db.collection("quotes").aggregate([
          {
            $match: {
              ...params,
            },
          },
          {
            $sort: {
              date: -1
            }
          }
        ]);

        cursor.toArray((err, doc) => {
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
        .updateOne({_id: new ObjectID(id)}, { $set: {...quote, count: (quote.count ? quote.count + 1 : 1) }})
        .then((r) => {
        })
        .catch((err) => {
          console.error(err);
        });
    });
  },

  updateRating: (id, value, voter) => {
    return getDb().then((db) => {
      db.collection("quotes")
        .updateOne(
          { _id: new ObjectID(id) },
          { 
            $inc: { rating: value },
            $push: {
              voteList: {
                voter: voter,
                date: new Date(),
                value: value
              } 
            } 
          },
        )
        .then((r) => {
          return r;
        })
        .catch((err) => {
          console.error(err);
        });
    });
  },

  rareScores: (chatId) => {
    return getDb().then(db => {
      return new Promise((resolve, reject) => {
        const cursor = db.collection("quotes")
          .aggregate([
            {
              $match: {
                chatId
              }
            },
            {
              $group: {
                _id: "$count",
                count: { $sum: 1 }
              }
            }
          ])

        cursor.toArray((err, doc) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(doc);
        });
      })
    });
  }
};
