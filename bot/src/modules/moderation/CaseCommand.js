const { MessageEmbed, Message } = require('discord.js');
const BaseSlashCommand = require('../../utils/structures/BaseSlashCommand');
const modules = require('../../database/Modules');
const auditLogs = require('../../database/ModuleSettings');
const punishments = require('../../database/Punishments');

module.exports = class TestCommand extends BaseSlashCommand{
  constructor() {
    super('case', 'Get detailed information about a specific case', "", [
      {
          name: "case",
          description: "Case number",
          required: true,
          type: "INTEGER"
      },
    ]);
  }

  async run(client, interaction, args) {
    const [caseNumber] = args;
    const guild = interaction.member.guild;

    let module = await modules.findOne({where: { guild_id: guild.id }});
    if(!module.moderation) return interaction.reply({content: "This module is not enabled.", ephemeral: true});

    const tempNoPermissionsEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription("You do not have permission to run this command!")

    const member = interaction.member;
    if(!member.permissions.has("VIEW_AUDIT_LOG")) return interaction.reply({embeds: [tempNoPermissionsEmbed], ephemeral: true});

    let userCase = await punishments.findOne({where: {case_number: caseNumber, guild_id: interaction.guildId}});
    if(!userCase) return interaction.reply(`That case does not exist in our system.`, {ephemeral: true});

    let user = interaction.guild.members.cache.get(userCase.user_id);
    let staff = interaction.guild.members.cache.get(userCase.staff_id);

    let caseEmbed = new MessageEmbed()
        .setAuthor(`${user ? user.user.tag : "Unknown#0000"} | Case #${userCase.case_number}`)
        .setColor(client.hex_color)
        .addField(`Staff Member`, `${staff}`, true)
        .addField(`Active`, `${userCase.active}`, true)
        .addField(`Expiration`, userCase.expiration ? `<t:${userCase.expiration}:R>` : "∞", true)
        .addField(`Reason`, userCase.reason)
        .setImage(userCase.proof ? userCase.proof : null);

    interaction.reply({embeds: [caseEmbed]});
  }
}