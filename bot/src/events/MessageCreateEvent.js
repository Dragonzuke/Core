// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
const BaseEvent = require('../utils/structures/BaseEvent');


module.exports = class MessageCreateEvent extends BaseEvent {
  constructor() {
    super('messageCreate');
  }
  
  async run(client, message) {
      if(message.content.toLowerCase() === "!deploy" && message.author.id === "270304325870419978") {
          message.delete();

          for(let cmd of client.registerSlashCommands) { 
            await client.application?.commands.create(cmd).then(() => {
              console.log("Completed command updates.");
              message.channel.send(`<:addChannel:888613561990008833> Command updates completed successfully.`);
            }).catch(err => {
              console.log(err);
              message.channel.send(`<:deleteChannel:888613562229084170> There was an error updating the commands.`);
            })
          }
          message.channel.send(`<:updateChannel:888613561725759499> Updating slash commands globally.\n__**Note:**__ This could take up to 1 hour, so please be patient.`);
      }
  }
}