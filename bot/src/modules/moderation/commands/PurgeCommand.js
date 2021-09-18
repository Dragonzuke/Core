const { MessageEmbed, Message } = require('discord.js');
const BaseSlashCommand = require('../../../utils/structures/BaseSlashCommand');
const settings = require('../../../database/Settings');

module.exports = class TestCommand extends BaseSlashCommand{
  constructor() {
    super('purge', 'Purge the channel of messages', "", [
      {
        name: "number",
        description: "Number of messages to delete",
        required: false,
        type: "INTEGER"
      },
    ]);
  }

  async run(client, interaction, args) {
    const [number] = args;
    const guild = interaction.member.guild;
    let channel = guild.channels.cache.get(interaction.channelId);

    const member = interaction.member;
    const tempNoPermissionsEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription("You do not have permission to run this command!")

    if(!member.permissions.has("MANAGE_MESSAGES")) return interaction.reply({embeds: [tempNoPermissionsEmbed], ephemeral: true});

    channel.messages.fetch({limit: number ? number : 100}).then(messages => { 
        messages.forEach(message => message.delete());
     }).then(interaction.reply(`Purged the channel`, {ephemeral: true}))
  }
}