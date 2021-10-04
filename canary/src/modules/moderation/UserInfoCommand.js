const { MessageEmbed, Message } = require('discord.js');
const BaseSlashCommand = require('../../utils/structures/BaseSlashCommand');
const moment = require('moment');

const coreUserData = require('../../database/Core/Users');

module.exports = class TestCommand extends BaseSlashCommand{
  constructor() {
    super('userinfo', '', "USER", []);
  }

  async run(client, interaction, args) {

    const user = interaction.targetId;
    const guild = interaction.member.guild;
    const target = guild.members.cache.get(user);

    const roles = target.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);

    let userData = await coreUserData.findAll({where: {user_id: target.id}});

    const userInfoEmbed = new MessageEmbed()
      .setThumbnail(target.user.displayAvatarURL({dynamic: true, size: 512}))
      .setAuthor(`${target.user.tag} Information`)
      .setColor(target.roles.highest.color === 0 ? client.hex_color : target.roles.highest.color)
      .setDescription(`${target}`)
      .addField(`Joined`, `${moment(target.joinedAt).format("ddd, MMM Do, YYYY h:mm a")}`, true)
      .addField(`Registered`, `${moment(target.user.createdAt).format("ddd, MMM Do, YYYY h:mm a")}`, true)
      .addField(`Roles [${roles.length}]`, `${roles.join(', ')}`)
    
      if(userData) {
        let array = [];
        userData.forEach((acknowledgements) => {
          array.push(acknowledgements.getDataValue(`acknowledgements`))
        });
        if(array.length >= 1) userInfoEmbed.addField(`Acknowledgements`, array.join('\n'));
      }

    interaction.reply({embeds: [userInfoEmbed]});
  }
}