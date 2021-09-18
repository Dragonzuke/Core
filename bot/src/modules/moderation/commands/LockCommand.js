const { MessageEmbed, Message } = require('discord.js');
const BaseSlashCommand = require('../../../utils/structures/BaseSlashCommand');
const settings = require('../../../database/Settings');

module.exports = class TestCommand extends BaseSlashCommand{
  constructor() {
    super('lock', 'Lock a channel', "", [
      {
        name: "channel",
        description: "Select a channel to lock",
        required: false,
        type: "CHANNEL"
      },
    ]);
  }

  async run(client, interaction, args) {
    const [channel] = args;
    const guild = interaction.member.guild;
    if(!channel) channel = guild.channels.cache.get(interaction.channelId);
    let guildChannel = guild.channels.cache.get(channel);

    const member = interaction.member;
    const tempNoPermissionsEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription("You do not have permission to run this command!")

    if(!member.permissions.has("MANAGE_CHANNELS")) return interaction.reply({embeds: [tempNoPermissionsEmbed], ephemeral: true});

    let guildData = settings.findOne({where: {guild_id: guild.id}});
    let memberRole = guild.roles.cache.get(guildData.member_role);
    if(!memberRole) memberRole = guild.roles.everyone;

    guildChannel.send(`<:blurplelock:884557462928240681> Channel locked.`);
    guildChannel.permissionOverwrites.edit(memberRole, { SEND_MESSAGES: false });
    interaction.reply(`Locked the channel ${guildChannel}`);
  }
}