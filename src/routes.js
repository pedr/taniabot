
const token = process.env.TOKEN;

const routes = (app, bot, vault) => {
  
  app.post(`/bot${token}`, (req, res) => {
    console.log('alo algo aconteceu')
    bot.processUpdate(req.body);
    res.sendStatus(200);
  })
  
  app.get("/", (req, res) => {
    res.send("<p>hello world</p>");
  })

  app.get("/page/:secret", (req, res) => {
    const paramSecret = req.params.secret;

    console.log({paramSecret})
    if (paramSecret) {
      const { status, secret } = vault.check(paramSecret);
      console.log({status})
      if (status) {
        return res.send(`<p>liberado ${secret}</p>`);
      }
    } 
    res.status(403);
    res.send("<p>get out</p>")
  })
}

module.exports = routes;
