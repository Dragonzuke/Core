const { MessageEmbed, Message } = require('discord.js');
const BaseSlashCommand = require('../../../utils/structures/BaseSlashCommand');
const modules = require('../../../database/Modules');
const auditLogs = require('../../../database/ModuleSettings');
const punishments = require('../../../database/Punishments');

module.exports = class TestCommand extends BaseSlashCommand{
  constructor() {
    super('slowmode', 'Set the slowmode of a channel', "", [
      {
          name: "time_unit",
          description: "The unit of time you want",
          required: true,
          type: "STRING",
          choices: [
            {
                name: "Seconds",
                value: "time_sec"
            },
            {
                name: "Minutes",
                value: "time_min"
            },
            {
                name: "Hours",
                value: "time_hrs"
            },
            {
                name: "Disable",
                value: "time_disable"
            }
        ]
      },
      {
          name: "time",
          description: "The lengh of the slowmode",
          required: false,
          type: "INTEGER"
      },
      {
        name: "channel",
        description: "The channel you want to set slowmode in",
        required: false,
        type: "CHANNEL",
    },
    ]);
  }

  async run(client, interaction, args) {
    let [ time_unit, time, channel] = args;

    const guild = interaction.member.guild;

    let module = await modules.findOne({where: { guild_id: guild.id }});
    if(!module.moderation) return interaction.reply({content: "This module is not enabled.", ephemeral: true});

    const tempNoPermissionsEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription("You do not have permission to run this command!")

    const member = interaction.member;
    if(!member.permissions.has("MANAGE_CHANNELS")) return interaction.reply({embeds: [tempNoPermissionsEmbed], ephemeral: true});

    if(!channel) channel = guild.channels.cache.get(interaction.channelId);

    if(!time && time_unit !== "time_disable") return interaction.reply({content: `You must include a time!`, ephemeral: true});

    if(time_unit === "time_hrs" && time > 6) return interaction.reply({content: `Time must be less than or equal to 6 hours!`, ephemeral: true});
    if(time_unit === "time_min") time = time * 60;
    if(time_unit === "time_hrs") time = (time * 60) * 60;
    
    channel.setRateLimitPerUser(time || 0);

    if(time_unit === "time_min") time = time / 60;
    if(time_unit === "time_hrs") time = (time / 60) / 60;

    let slowmodeEmbed = new MessageEmbed().setColor(client.hex_color);
    if(time) slowmodeEmbed.setDescription(`Slowmode has been enabled by ${interaction.member} for ${time} ${humanize(time_unit)}`);
    else slowmodeEmbed.setDescription(`Slowmode has been disabled by ${interaction.member}.`);

    let slowmodeChannel = guild.channels.cache.get(channel.id);

    slowmodeChannel.send({embeds: [slowmodeEmbed]});
    interaction.reply({content: 'Slowmode set successfully', ephemeral: true});
  }
}

function humanize(str) {
    let i, frags = str.split('_');
    for (i=0; i<frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }
    return frags.join(' ');
  }