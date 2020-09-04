const { getDb, ObjectID } = require("../../database");

module.exports = {

  getRandom: () => {

    return getDb().then((db) => {
      return new Promise((resolve, reject) => {
        const cursor = db.collection("phrases").aggregate([
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

};
