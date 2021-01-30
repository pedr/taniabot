require("dotenv").config();

const { app, bot } = require("./src/configs");
const routes = require("./src/routes");
const botCommands = require("./src/botCommands");
const SecretVault = require("./src/utils/SecretVault");

const Vault = SecretVault();

routes(app, bot, Vault);
botCommands(bot, Vault);