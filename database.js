require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

const dbUrl = process.env.DB_URL;

const client = new MongoClient(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .connect()

const db = client.then(c => c.db('telegram_bot'))

module.exports = {
  getDb: function() {
    return new Promise((resolve, reject) => {
      return db.then(r => {
        resolve(r)
      })
        .catch(err => {
          reject(err)
        })
    })
  },
  ObjectID: ObjectID
};
