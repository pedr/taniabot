require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const dbUrl = process.env.DB_URL

const client = new MongoClient(dbUrl, {
    useNewUrlParser: true,
})

client.connect((err) => {
    if (err) return console.error(err)

    const usersCollection = client.db("telegram_bot").collection("users");

    usersCollection.find({}).each((err, doc) => {
        if (err) return console.error(err)

        console.log(doc)
    });
})

const db = {}

module.exports = db