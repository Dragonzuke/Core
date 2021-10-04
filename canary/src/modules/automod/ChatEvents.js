const BaseEvent = require('../../utils/structures/BaseEvent');

const punishments = require('../../database/Punishments');
const moduleSettings = require('../../database/ModuleSettings');
const modules = require('../../database/Modules');
const { MessageEmbed, UserManager } = require('discord.js');
module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super('messageCreate');
  }
  async run (client, message) {
      if(message.author.bot) return;
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
                addPunishment(message.member, message, "chat_filter", settings.chat_filter_punishment, 
                    settings.chat_filter_punishment === "mute" ? settings.mute_duration : settings.chat_filter_punishment === "ban" ? settings.ban_duration : null);
            }
        }
    }

    //* Ping Filter
    if(settings.ping_filter_enabled && message.mentions.users.size > settings.number_of_pings_allowed) {
        addPunishment(message.member, message, "ping_filter", settings.chat_filter_punishment,
            settings.chat_filter_punishment === "mute" ? settings.mute_duration : settings.chat_filter_punishment === "ban" ? settings.ban_duration : null)
    }

    //* Spam Filter
    if(settings.spam_filter_enabled) {
        let filter = msg => { return msg.author == message.author; }

        message.channel.awaitMessages({
            filter,
            max: settings.number_of_messages_allowed,
            time: settings.time_between_messages * 1000
        }).then(collected => {
            if(collected.size < settings.number_of_messages_allowed) return;
            collected.clear();
            addPunishment(message.member, message, "spam_filter", settings.spam_filter_punishment,
                settings.spam_filter_punishment === "mute" ? settings.mute_duration : settings.chat_filter_punishment === "ban" ? settings.ban_duration : null);
        });
    }

    //* Link Filter

  }
}

function addPunishment(user, message, type, punishment, time) {
    let punishmentEmbed = new MessageEmbed()
        .setColor("#2f3136")
        .setDescription(`${user} has been ${punishment}ed`);

    let punishmentType;
    let punishmentActive = time ? true : punishment ? "warn" || "kick" ? true : false : false;
    let epochTime;

    switch(punishment) {
        case "warn": punishmentType = 'warning'; break;
        case "kick": punishmentType = 'kick'; break;
        case "mute": punishmentType = 'mute'; break;
        case "ban": punishmentType = 'ban'; break;
    }

    switch(type) {
        case "chat_filter": punishmentEmbed.addField(`Reason`, `Bad language use.`); break;
        case "ping_filter": punishmentEmbed.addField(`Reason`, `Too many pings`); break;
        case "spam_filter": punishmentEmbed.addField(`Reason`, `Too many messages too fast!`); break;
    }

    if(time) {
        const now = new Date();
        if(time > 1) now.setHours(now.getHours() + time);
        if(time < 1 && time > 0) now.setMinutes(now.getMinutes() + Math.round(time * 60));
        epochTime = Math.round(now.getTime() / 1000);
    }

    punishments.create({
        guild_id: message.guild.id,
        user_id: user.id,
        staff_id: "885346721155145738",
        type: punishmentType,
        active: punishmentActive,
        expiration: epochTime ? epochTime : null,
        reason: punishmentEmbed.fields[0].value
    })

    return message.channel.send({embeds: [punishmentEmbed]});
}