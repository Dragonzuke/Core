
const { Client, Intents } = require('discord.js');
const { registerCommands, registerEvents, registerSlashCommands } = require('./utils/registry');
const config = require('../slappey.json');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]});

const database = require('./database/Database');
const modules = require('./database/Modules');
const moduleSettings = require('./database/ModuleSettings');
const punishments = require('./database/Punishments');
const settings = require('./database/Settings');

const coreDatabase = require('./database/Core/CoreDatabase');
const coreUserData = require('./database/Core/Users');

database.authenticate().then(() => {
  modules.init(database);
  modules.sync();
  moduleSettings.init(database);
  moduleSettings.sync();
  punishments.init(database);
  punishments.sync();
  settings.init(database);
  settings.sync();
  console.log("Database Connected!");
}).catch(err => console.log(err));

coreDatabase.authenticate().then(() => {
  coreUserData.init(coreDatabase);
  coreUserData.sync();

  console.log("Core Database Connected!");
}).catch(err => console.log(err));

(async () => {
  client.commands = new Map();
  client.slashCommands = new Map();
  client.events = new Map();
  client.registerSlashCommands = [];
  client.hex_color = "#0081b5";
  await registerSlashCommands(client, '../modules/moderation/commands');
  await registerSlashCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(config.token);
})();

