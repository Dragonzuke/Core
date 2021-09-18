const BaseEvent = require('../utils/structures/BaseEvent');

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super('interactionCreate');
  }
  async run (client, interaction) {
    if(interaction.isSelectMenu()) {
      let newsRole = interaction.member.guild.roles.cache.get("881986905477103676");
      let statusRole = interaction.member.guild.roles.cache.get("881986939316744245");

      if(interaction.values.includes("news_option")) interaction.member.roles.add(newsRole);
      if(interaction.values.includes("status_option")) interaction.member.roles.add(statusRole);

      if(interaction.member.roles.cache.some(role => role.id === newsRole.id) && !interaction.values.includes("news_option")) interaction.member.roles.remove(newsRole.id);
      if(interaction.member.roles.cache.some(role => role.id === statusRole.id) && !interaction.values.includes("status_option")) interaction.member.roles.remove(statusRole.id);
  
      return interaction.reply({content: `Roles have been updated.`, ephemeral: true});
    }

    if(interaction.isButton()) {
      if(interaction.customId === "verify_user") {
        let userRole = interaction.member.guild.roles.cache.get("883141100523647036");
        let notificationSeperator = interaction.member.guild.roles.cache.get("881986891497488386");
        if(interaction.member.roles.cache.some(role => role.id === userRole.id)) return interaction.reply({content: `You have already proved that you are a user.`, ephemeral: true});
        interaction.member.roles.add([userRole, notificationSeperator]);
        return interaction.reply({content: `You are indeed a user, good.`, ephemeral: true});
      }
    }
  }
}