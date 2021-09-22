const BaseEvent = require('../../utils/structures/BaseEvent');

const punishments = require('../../database/Punishments');
const moduleSettings = require('../../database/ModuleSettings');
const modules = require('../../database/Modules');
const { MessageEmbed } = require('discord.js');

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super('messageCreate');
  }
  async run (client, message) {
    let module = await modules.findOne({where: {guild_id: message.guild.id}});
    if(!module.automod) return;

    let settings = await moduleSettings.findOne({where: {guild_id: message.guild.id}});

    //* Chat Filter
    if(settings.chat_filter_enabled) {
        let filter = JSON.parse(settings.chat_filter) || [];
        let lowercase = message.content.toLowerCase();
        for(let i = 0; i < filter.length; i++) {
            //if(message.member.permissions.has("MANAGE_MESSAGES")) return;
            if(lowercase.includes(filter[i].toLowerCase())) {
                if(message.deletable) message.delete();
                addPunishment(message.member, message, "chat_filter", settings.chat_filter_punishment);
            }
        }
    }
  }
}

function addPunishment(user, message, type, punishment) {
    let punishmentEmbed = new MessageEmbed()
        .setColor("#2f3136")
        .setDescription(`${user} has been ${punishment}ed`);

    let punishmentType;
    let punishmentActive;
    let punishmentExpiration;

    switch(punishment) {
        case "warn": punishmentType = 'warning'
        case "kick": punishmentType = 'kick'
        case "mute": punishmentType = 'mute'
        case "ban": punishmentType = 'ban'
    }

    switch(type) {
        case "chat_filter":
            punishmentEmbed.addField(`Reason`, `Bad language use.`);
            punishmentActive = true;
        case "ping_filter":
            punishmentEmbed.addField(`Reason`, `Too many pings`);
            punishmentActive = true;
    }

    punishments.create({
        guild_id: message.guild.id,
        user_id: user.id,
        staff_id: "885346721155145738",
        type: punishmentType,
        active: punishmentActive,
        expiration: punishmentExpiration ? punishmentExpiration : null,
        reason: punishmentEmbed.fields[0].value
    })

    return message.channel.send({embeds: [punishmentEmbed]})
}