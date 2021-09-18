const { MessageEmbed, Message } = require('discord.js');
const BaseSlashCommand = require('../../../utils/structures/BaseSlashCommand');
const modules = require('../../../database/Modules');
const auditLogs = require('../../../database/ModuleSettings');
const punishments = require('../../../database/Punishments');

module.exports = class TestCommand extends BaseSlashCommand{
  constructor() {
    super('infractions', 'Get the infractions of a user', "", [
      {
          name: "user",
          description: "User",
          required: true,
          type: "USER"
      },
    ]);
  }

  async run(client, interaction, args) {
    const [user] = args;
    const guild = interaction.member.guild;

    let module = await modules.findOne({where: { guild_id: guild.id }});
    if(!module.moderation) return interaction.reply({content: "This module is not enabled.", ephemeral: true});

    const tempNoPermissionsEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription("You do not have permission to run this command!")

    const member = interaction.member;
    if(!member.permissions.has("VIEW_AUDIT_LOG")) return interaction.reply({embeds: [tempNoPermissionsEmbed], ephemeral: true});

    let userCase = await punishments.findAll({where: {user_id: user, guild_id: interaction.guildId}});
    if(!userCase) return interaction.reply(`That case does not exist in our system.`, {ephemeral: true});

    let latest10 = await punishments.findAll({limit: 10, where: {user_id: user, guild_id: interaction.guildId}, order: [["createdAt", "DESC"]]});

    let last24Hours = [];
    let last7Days = [];
    const currentDate = new Date();

    for(let _cases of userCase) {
      let date = new Date(_cases.getDataValue("createdAt"));
      let differenceInDays = (currentDate.getTime() - date.getTime()) / (1000 * 3600 * 24);
      if(differenceInDays <= 1) last24Hours.push(_cases);
      if(differenceInDays > 1 && differenceInDays <= 7) last7Days.push(_cases);
    }

    let latestInfractions = latest10.map((latest) => {
      let infractionDate = new Date(latest.getDataValue("createdAt"))
      let epoch = Math.round(infractionDate.getTime() / 1000);
      return `**${latest.getDataValue("type").charAt(0).toUpperCase() + latest.getDataValue("type").slice(1)}** • <t:${epoch}> • \`(Case #${latest.getDataValue("case_number")})\``
    }).join(`\n`);

    let _user = interaction.guild.members.cache.get(user);

    let infractionEmbed = new MessageEmbed()
      .setColor(client.hex_color)
      .setAuthor(`${_user ? _user.user.tag : "Unknown#0000"} Infractions`)
      .addField(`Last 24 Hours`, `${last24Hours <= 1 ? `${last24Hours.length} infraction` : `${last24Hours.length} infractions`}`, true)
      .addField(`Last 7 Days`, `${last7Days <= 1 ? `${last7Days.length} infraction` : `${last7Days.length} infractions`}`, true)
      .addField(`Total`, `${userCase.length <= 1 ? `${userCase.length} infraction` : `${userCase.length} infractions`}`, true)
      .addField(`Latest 10 Infractions`, `${latestInfractions ? latestInfractions : `No infractions on record.`}`);

    interaction.reply({embeds: [infractionEmbed]});
  }
}