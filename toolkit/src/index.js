
const { Client, Intents } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const config = require('../slappey.json');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES]});

const database = require('./database/CoreDatabase');
const userData = require('./database/Users');

database.authenticate().then(() => {
  userData.init(database);
  userData.sync();
  console.log('Database Connected');
}).catch(err => console.log(err));

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.prefix = config.prefix;
  client.hex_color = "#0081b5";
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(config.token);
})();

