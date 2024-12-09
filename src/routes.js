
const token = process.env.TOKEN;
const {getAllFromChat} = require("./database/quotes");
const path = require('path');

const routes = (app, bot, vault) => {
  
  app.post(`/bot${token}`, (req, res) => {
    console.log('alo algo aconteceu')
    bot.processUpdate(req.body);
    res.sendStatus(200);
  })
  
  app.get("/", (req, res) => {
    res.send("<p>hello world</p>");
  })

  app.get("/page/:secret", async (req, res) => {
    const paramSecret = req.params.secret;

    if (paramSecret) {
      const { status, secret } = vault.check(paramSecret);

      if (status) {
        const allMsgs = await getAllFromChat(secret.chatId);
        const dataToHuman = n => {
          const d = new Date(n * 1000);
          var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
          return d.toLocaleDateString('pt-br', options);
        }

        return res.render("pages/quotes", { quotes: allMsgs.map(e => ({...e, date: dataToHuman(e.date)}))});
      }
    } 
    res.status(403);
    res.send("<p>get out</p>")
  })

}

module.exports = routes;
