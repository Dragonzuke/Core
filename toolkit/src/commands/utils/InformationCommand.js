const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class InformationCommand extends BaseCommand {
  constructor() {
    super('information', 'utils', []);
  }

  run(client, message, args) {
    
    let welcomeEmbed = new MessageEmbed()
      .setAuthor("Welcome to the Core Support Server!", "https://cdn.discordapp.com/emojis/884557462567550977.png?v=1")
      .setDescription("Welcome to the Core Support server! Below you will find all of the necessary information to get started on our server!")
      .setColor(client.hex_color);

    let supportRole = message.guild.roles.cache.get("886722107625594960");
    let helpDesk = message.guild.channels.cache.get("880208022960476190");

    let rulesEmbed = new MessageEmbed()
      .setAuthor("Server Rules", "https://cdn.discordapp.com/emojis/884557462907256842.png?v=1")
      .setDescription("Here are a few rules that you must follow while on this server. Not following these will result in some form of punishment."
      + "\n" + `**+** Follow the [Discord ToS](https://discord.com/terms) and the [Discord Guidelines](https://discord.com/guidelines) at all times.`
      + "\n" + `**+** Respect all users at all times.`
      + "\n" + `**+** No NSFW/Offensive/Controversial content at any time.`
      + "\n" + `**+** The act of self-promoting services, social media, etc. is not allowed.`
      + "\n" + `**+** If you need support, please ping our ${supportRole} in ${helpDesk}.`
      + "\n" + `**+** For the purposes of moderation and support, we ask that you only speak English.`)
      .addField("Moderator Note", "Please be aware that our moderators reserve the right to punish how they see fit based on context and intent by server members, and may take action on misbehavior and infractions that are not explicitly said above.")
      .setFooter("Last Updated on 12th of September 2021")
      .setColor(client.hex_color);

    let adminRole = message.guild.roles.cache.get("886723020813656114");
    let modRole = message.guild.roles.cache.get("886722370268717076");
    let coreTeamRole = message.guild.roles.cache.get("886723985197371422");
    let coreBotsRole = message.guild.roles.cache.get("883133072978087947");

    let importantRoles = new MessageEmbed()
      .setAuthor("Important Roles", "https://cdn.discordapp.com/emojis/884557462970200074.png?v=1")
      .setColor(client.hex_color)
      .setDescription(`${coreBotsRole} - Official Bots`
      + "\n" + `${adminRole} - Managers of the staff team. Please direct your concerns to them.`
      + "\n" + `${modRole} - Protectors of the server. Enforces rules and handles infractions.`
      + "\n" + `${supportRole} - Handles tickets and any support needed for the bots.`
      + "\n" + `${coreTeamRole} - Staff needed for our bots to run; developers and necessary personnel.`);

    let selectRoles = new MessageEmbed()
      .setAuthor("Role Select", "https://cdn.discordapp.com/emojis/884557462886314045.png?v=1")
      .setDescription("If you would like to get notified about specific things, please select a notification role from the drop down menu below!")
      .setColor(client.hex_color)

    const row = new MessageActionRow()
      .addComponents(new MessageSelectMenu()
        .setCustomId("select_roles")
        .setPlaceholder("Select a Role")
        .setMinValues(0)
        .setMaxValues(2)
        .addOptions([
          {
            label: "News Updates",
            description: "Get notifications about any bot news.",
            value: "news_option"
          },
          {
            label: "Status Updates",
            description: "Get updates on the status of the bots if they go down.",
            value: "status_option"
          }
        ]));

    const verifyUser = new MessageEmbed()
        .setDescription("To verify that you are a user and not a bot, please click on the button down below.")
        .setColor(client.hex_color);

    const buttonRow = new MessageActionRow().addComponents(new MessageButton()
      .setCustomId("verify_user")
      .setLabel("Verify Me")
      .setStyle("SECONDARY")
      .setEmoji("<:blurplelock:884557462928240681>"));

    
    message.channel.send({ embeds: [welcomeEmbed, rulesEmbed, importantRoles, selectRoles], components: [row] });
    message.channel.send({embeds: [verifyUser], components: [buttonRow]});

  }
}