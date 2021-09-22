const { MessageEmbed, Message } = require('discord.js');
const BaseSlashCommand = require('../../utils/structures/BaseSlashCommand');
const modules = require('../../database/Modules');
const auditLogs = require('../../database/ModuleSettings');
const punishments = require('../../database/Punishments');

module.exports = class TestCommand extends BaseSlashCommand{
  constructor() {
    super('kick', 'Ban a user', "", [
      {
        name: "user",
        description: "Pick a user to ban",
        required: true,
        type: "USER"
      },
      {
          name: "reason",
          description: "Reason for punishment",
          required: false,
          type: "STRING"
      },
      {
        name: "proof",
        description: "Proof for the punishment",
        required: false,
        type: "STRING"
    }
    ]);
  }

  async run(client, interaction, args) {
    const [user, message, proof] = args;
    const guild = interaction.member.guild;

    let module = await modules.findOne({where: { guild_id: guild.id }});
    if(!module.moderation) return interaction.reply({content: "This module is not enabled.", ephemeral: true});

    let logs = await auditLogs.findOne({where: {guild_id: guild.id}});

    const logChannel = guild.channels.cache.get(logs.mod_log_channel);
    const messageChannel = guild.channels.cache.get(interaction.channelId);

    const member = interaction.member;

    const tempNoPermissionsEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription("You do not have permission to run this command!")

    if(!member.permissions.has("BAN_MEMBERS")) return interaction.reply({embeds: [tempNoPermissionsEmbed], ephemeral: true});

    let newPunishment = await punishments.create({
      guild_id: guild.id,
      user_id: user,
      staff_id: interaction.member.id,
      type: "ban",
      active: true,
      expiration: null,
      reason: message,
      proof: proof ? proof : null
    });

    const warnEmbedChannel = new MessageEmbed()
        .setColor("#2f3136")
        .setDescription(`${guild.members.cache.get(user)} has been banned`)
        .addField("Reason", `${message ? message : `Banned by ${interaction.member}`}`);

    messageChannel.send({embeds: [warnEmbedChannel]}).then(() => interaction.reply({ content: `Successfully banned ${guild.members.cache.get(user)}`, ephemeral: true}));

    if(logs.mod_log_enabled && logChannel) {
      let logEmbed = new MessageEmbed()
        .setAuthor(`${guild.members.cache.get(user).user.tag} | Case #${newPunishment.getDataValue("case_number")}`)
        .setDescription(`A ban has been issues by ${member}`)
        .addField(`Reason`, `${message ? message : `Banned by ${interaction.member}`}`, true)
        .addField(`Active`, `${newPunishment.getDataValue("active")}`, true)
        .addField(`Expiration`, newPunishment.getDataValue("expiration") ? newPunishment.getDataValue("expiration") : "∞", true)
        .setColor(client.hex_color);

      if(proof) logEmbed.setImage(proof);

      logChannel.send({embeds: [logEmbed]});
      member.kick({reason: message});
    }
  }
}