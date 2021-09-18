const { MessageEmbed, Message } = require('discord.js');
const BaseSlashCommand = require('../utils/structures/BaseSlashCommand');

module.exports = class TestCommand extends BaseSlashCommand{
  constructor() {
    super('ping', 'Get current ping', "", []);
  }

  async run(client, interaction, args) {
    await interaction.deferReply().catch(() => {});

    interaction.editReply(`<:binfo:884960254989832192> Pinging...`).then(msg => {
        let pingEmbed = new MessageEmbed()
            .setAuthor(`ZeroDay Ping Information`)
            .setColor("#66579e")
            .addField(`Bot Latency`, `${msg.createdTimestamp - Date.now()}ms`, true)
            .addField(`API Latency`, `${Math.round(client.ws.ping)}ms`, true);

        msg.edit({embeds: [pingEmbed], content: null});
    })
  }
}