require("dotenv").config({ path: __dirname + "/.env" });

console.log(process.env.DB_URL);

const { app, bot } = require("./src/configs");
const routes = require("./src/routes");
const botCommands = require("./src/botCommands");
const SecretVault = require("./src/utils/SecretVault");

const Vault = SecretVault();

routes(app, bot, Vault);
botCommands(bot, Vault);
