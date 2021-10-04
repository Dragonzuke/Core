// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
const BaseEvent = require('../utils/structures/BaseEvent');
const modules = require('../database/Modules');
const moduleSettings = require('../database/ModuleSettings');
const settings = require('../database/Settings');


module.exports = class GuildCreateEvent extends BaseEvent {
  constructor() {
    super('guildCreate');
  }
  
  async run(client, guild) {

    let modRoles = [], adminRoles = [];

    for(let roles; roles < guild.roles.length; roles++) {
      if(roles.hasPermission("KICK_MEMBERS")) modRoles.push(roles.id);
      if(roles.hasPermission("MANAGE_SERVER")) adminRoles.push(roles.id);
    }

    settings.create({
      guild_id: guild.id,
      moderator_roles: JSON.stringify(modRoles),
      admin_roles: JSON.stringify(adminRoles),
      mute_role: null,
    });

    modules.create({
      guild_id: guild.id,
      security: false,
      moderation: true,
      automod: false,
      auditlog: false,
      tickets: false
    });

    moduleSettings.create({
      guild_id: guild.id,
      security_days: 2,
      warning_to_next: 3,
      mute_to_next: 2,
      kick_to_next: 1,
      tempban_to_next: 0,
      chat_filter_enabled: false,
      chat_filter: null,
      chat_filter_punishment: "warn",
      ping_filter_enabled: false,
      number_of_pings_allowed: 5,
      ping_filter_punishment: "mute",
      spam_filter_enabled: false,
      number_of_messages_allowed: 10,
      spam_filter_punishment: "warn",
      link_filter_enabled: false,
      link_whitelist: null,
      link_filter_punishment: "mute",
      mod_log_enabled: false,
      mod_log_channel: null,
      invite_log_enabled: false,
      invite_log_channel: null,
      jl_log_enabled: false,
      jl_log_channel: null,
      ticket_support_roles: null,
      ticket_category: null,
      ticket_channel_ping: false,
      ticket_channel_ping_roles: null,
      ticket_message: "Please wait for our Support Team to get back to you.",
      ticket_embed_enabled: false,
      ticket_embed_title: "Support",
      ticket_embed_description: "Please be patient for the next available agent :)",
      ticket_embed_color: "BLUE"
    })
  }
}