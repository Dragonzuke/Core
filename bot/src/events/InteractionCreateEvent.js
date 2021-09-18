const BaseEvent = require('../utils/structures/BaseEvent');
const modules = require('../database/Modules');
const { MessageEmbed, Message, MessageActionRow, MessageButton } = require('discord.js');

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super('interactionCreate');
  }
  async run (client, interaction) {
    if(interaction.isCommand()) {
      //await interaction.deferReply({ ephemeral: false }).catch(() => {});

      const cmd = client.slashCommands.get(interaction.commandName);
      if(!cmd) return interaction.followUp({content: "An error has occured: No command found!"});

      const args = [];

      for(let option of interaction.options.data) {
        if(option.type === "SUB_COMMAND") {
          if(option.name) args.push(option.name);
          option.options?.forEach((x) => { if(x.value) args.push(x.value) });
        } else if(option.value) args.push(option.value);
      }
      interaction.member = interaction.guild.members.cache.get(interaction.user.id);
      cmd.run(client, interaction, args);
    }

    if(interaction.isContextMenu()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if(cmd) cmd.run(client, interaction);
    }

    if(interaction.isButton()) {
      let guild = interaction.member.guild;
      let module = await modules.findOne({where: {guild_id: guild.id}});

      // Plugin Status Buttons
      if(interaction.customId === "security") {
        const buttons = new MessageActionRow().addComponents(
          new MessageButton()
              .setCustomId("security_settings")
              .setLabel("Settings")
              .setStyle("SECONDARY")
              .setEmoji("🛠️"),
          new MessageButton()
              .setCustomId("security_status")
              .setLabel(module.security ? "Disable" : "Enable")
              .setStyle(module.security ? "DANGER" : "SUCCESS")
              .setEmoji(module.security ? "<:not_selected:880214132199157810>" : "<:success:880214132077510729>"))
        interaction.reply({content: `Choose an action.`, components: [buttons], ephemeral: true});
      }

      //Plugin Actions
      if(interaction.customId === "security_status") {
        module.security = !module.security;
        module.save();
        interaction.reply({content: `Security plugin has been ${module.security ? "enabled" : "disabled"}`, ephemeral: true});
      }
      if(interaction.customId === "security_settings") interaction.reply({content: `This feature is coming soon...`, ephemeral: true});
    }
  }
}