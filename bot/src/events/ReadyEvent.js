const BaseEvent = require('../utils/structures/BaseEvent');

const punishments = require('../database/Punishments');
const settings = require('../database/Settings');
const { Op } = require('sequelize');

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready');
  }
  async run (client) {
    console.log(client.user.tag + ' has logged in.');
    client.user.setActivity("In Development", {
      type: "STREAMING",
      url: "https://www.twitch.tv/devzuke"
    });

    for(let cmd of client.registerSlashCommands) { await client.guilds.cache.get("880200519602278441").commands.create(cmd); }

    let now;

    const checkMutes = async () => {
      now = Math.round(Date.now() / 1000);
      const results = await punishments.findAll({where: {
        active: true,
        type: "mute",
        expiration: { [Op.lt]: now }
      }});
      if(results && results.length) {
        for(const result of results) {
          const guild = client.guilds.cache.get(result.getDataValue("guild_id"))
          const member = (await guild.members.fetch()).get(result.getDataValue("user_id"));

          const settingsData = await settings.findOne({where: {guild_id: guild.id}});
          const mutedRole = guild.roles.cache.get(settingsData.muted_role);

          if(member.roles.cache.some(r => r.id === mutedRole.id)) member.roles.remove(mutedRole.id);

          result.setDataValue("active", false);
          result.save();
        }
      }
    }
    checkMutes();
    setInterval(async () => await checkMutes(), 1000);
  }
}