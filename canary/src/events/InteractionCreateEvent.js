const BaseEvent = require('../utils/structures/BaseEvent');
const modules = require('../database/Modules');
const moduleSettings = require('../database/ModuleSettings');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

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
      let moduleSetting = await moduleSettings.findOne({where: {guild_id: guild.id}});

      //* Plugin Status Buttons

      //* Security
      if(interaction.customId === "security") {
        const buttons = new MessageActionRow().addComponents(
          new MessageButton()
              .setCustomId("security_settings")
              .setLabel("Security Settings")
              .setStyle("SECONDARY")
              .setEmoji("🛠️"),
          new MessageButton()
              .setCustomId("security_status")
              .setLabel(module.security ? "Disable" : "Enable")
              .setStyle(module.security ? "DANGER" : "SUCCESS")
              .setEmoji(module.security ? "<:not_selected:880214132199157810>" : "<:success:880214132077510729>"))
        interaction.reply({content: `__**Security Options**__`, components: [buttons], ephemeral: true});
      }

      //* Logging
      if(interaction.customId === "auditlogs") {
        const buttons = new MessageActionRow().addComponents(
          new MessageButton()
              .setCustomId("auditlog_settings")
              .setLabel("Logging Settings")
              .setStyle("SECONDARY")
              .setEmoji("🛠️"),
          new MessageButton()
              .setCustomId("auditlog_status")
              .setLabel(module.auditlog ? "Disable" : "Enable")
              .setStyle(module.auditlog ? "DANGER" : "SUCCESS")
              .setEmoji(module.auditlog ? "<:not_selected:880214132199157810>" : "<:success:880214132077510729>"))
        interaction.reply({content: `__**Logging Options**__`, components: [buttons], ephemeral: true});
      }

      //* Plugin Actions

      //* Security
      if(interaction.customId === "security_status") {
        module.security = !module.security;
        module.save();
        interaction.reply({content: `Security plugin has been ${module.security ? "enabled" : "disabled"}`, ephemeral: true});
      }
      if(interaction.customId === "security_settings") interaction.reply({content: `This feature is coming soon...`, ephemeral: true});

      //* Logging
      if(interaction.customId === "auditlog_status") {
        module.auditlog = !module.auditlog;
        module.save();
        interaction.reply({content: `Security plugin has been ${module.auditlog ? "enabled" : "disabled"}`, ephemeral: true});
      }
      if(interaction.customId === "auditlog_settings") {
        const buttons = new MessageActionRow().addComponents(
          new MessageButton()
              .setCustomId("auditlog_settings_modlog")
              .setLabel("Moderation Log")
              .setStyle("SECONDARY")
              .setEmoji("🛠️"),
          new MessageButton()
            .setCustomId("auditlog_settings_messagelog")
            .setLabel("Message Log")
            .setStyle("SECONDARY")
            .setEmoji("📄"),
          new MessageButton()
            .setCustomId("auditlog_settings_invitelog")
            .setLabel("Invite Log")
            .setStyle("SECONDARY")
            .setEmoji("👋"),
          new MessageButton()
            .setCustomId("auditlog_settings_joinleavelog")
            .setLabel("Join/Leave Log")
            .setStyle("SECONDARY")
            .setEmoji("👮‍♂️"),
        )
        interaction.reply({content: `__**Logging Settings**__`, components: [buttons], ephemeral: true});
      }

      //* Plugin Settings

      //* Logging
      if(interaction.customId === "auditlog_settings_modlog") {
        let description = 
        `**Moderation Log:** ${module.mod_log ? "<:success:880214132077510729>" : "<:not_selected:880214132199157810>"}` +
        `\n` + `**Logging Channel: ** ${guild.channels.cache.find(ch => ch.id === moduleSetting.mod_log_channel) ? `${guild.channels.cache.find(ch => ch.id === moduleSetting.mod_log_channel)}` : `<:devwarning:884557462966009866> - No channel found.`}`

        let embed = new MessageEmbed()
          .setAuthor(`Logging Settings`)
          .setDescription(`━━━━━━━━━━━\n**Key:**\n<:success:880214132077510729> Enabled <:not_selected:880214132199157810> Disabled\n<:devwarning:884557462966009866> Error in Configuration\n━━━━━━━━━━━\n${description}`)
          .setColor(client.hex_color)
        
        let channels = guild.channels.cache.filter(channel => channel.type === "GUILD_TEXT")

        const selection = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("modlog_chat_selection")
            .setPlaceholder("Select a channel")
            .addOptions(channels.map((ch) => { return { label: ch.name, value: ch.id, }}))
        )

        interaction.reply({embeds: [embed], components: [selection], ephemeral: true});
      }
    }

    if(interaction.isSelectMenu()) {
      let guild = interaction.member.guild;
      let moduleSetting = await moduleSettings.findOne({where: {guild_id: guild.id}});

      if(interaction.customId === "modlog_chat_selection") {
        moduleSetting.mod_log_channel = interaction.values[0];
        moduleSetting.save();
        interaction.reply({content: `Successfully set the moderation log channel to ${guild.channels.cache.get(interaction.values[0])}`, ephemeral: true})
      }
    }
  }
}