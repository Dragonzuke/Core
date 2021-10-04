const { MessageEmbed, Message, MessageActionRow, MessageButton } = require('discord.js');
const BaseSlashCommand = require('../utils/structures/BaseSlashCommand');
const modules = require('../database/Modules');
const moduleSettings = require('../database/ModuleSettings');

module.exports = class TestCommand extends BaseSlashCommand{
  constructor() {
    super('plugins', 'List current plugins', "", []);
  }

  async run(client, interaction, args) {
    const tempNoPermissionsEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription("You do not have permission to run this command!")

    const member = interaction.member;
    if(!member.permissions.has("MANAGE_SERVER")) return interaction.reply({embeds: [tempNoPermissionsEmbed], ephemeral: true});

    const guild = interaction.member.guild;
    let module = await modules.findOne({where: { guild_id: guild.id }});
    let settings = await moduleSettings.findOne({where: {guild_id: guild.id}});

    let description = 
        `**Security:** ${errorChecking(guild, module, "security", settings) ? " <:devwarning:884557462966009866>" : module.security ? "<:success:880214132077510729>" : "<:not_selected:880214132199157810>"}`
        + "\n" + `**Moderation:** ${module.moderation ? "<:success:880214132077510729>" : "<:not_selected:880214132199157810>"}`
        + "\n" + `**Auto Moderation:** ${errorChecking(guild, module, "auto_mod", settings) ? " <:devwarning:884557462966009866>" : module.automod ? "<:success:880214132077510729>" : "<:not_selected:880214132199157810>"}`
        + "\n" + `**Logging:** ${errorChecking(guild, module, "logging", settings) ? " <:devwarning:884557462966009866>" : module.auditlog ? "<:success:880214132077510729>" : "<:not_selected:880214132199157810>"}`
        + "\n" + `**Tickets:** ${errorChecking(guild, module, "tickets", settings) ? " <:devwarning:884557462966009866>" : module.tickets ? "<:success:880214132077510729>" : "<:not_selected:880214132199157810>"}`

    let pluginEmbed = new MessageEmbed()
        .setAuthor(`Core Plugin Status`)
        .setDescription(`━━━━━━━━━━━\n**Key:**\n<:success:880214132077510729> Enabled <:not_selected:880214132199157810> Disabled\n<:devwarning:884557462966009866> Error in Configuration\n━━━━━━━━━━━\n${description}`)
        .setColor(client.hex_color)

    const buttons = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("security")
            .setLabel("Security")
            .setStyle("SECONDARY")
            .setEmoji("🔒"),
        new MessageButton()
            .setCustomId("moderation")
            .setLabel("Moderation")
            .setStyle("SECONDARY")
            .setEmoji("🛡️"),
        new MessageButton()
            .setCustomId("automod")
            .setLabel("Auto Mod")
            .setStyle("SECONDARY")
            .setEmoji("🤖"),
        new MessageButton()
            .setCustomId("auditlogs")
            .setLabel("Logging")
            .setStyle("SECONDARY")
            .setEmoji("📄"),
        new MessageButton()
            .setCustomId("tickets")
            .setLabel("Tickets")
            .setStyle("SECONDARY")
            .setEmoji("📁"),
    )

    interaction.reply({embeds: [pluginEmbed], ephemeral: true, components: [buttons]});
  }
}

function errorChecking(guild, module, plugin, setting) {
    if(!module.getDataValue(plugin)) return;

    //Security
    if(plugin === "security") { if(!setting.security_days) return true; }

    //Auto Moderation
    if(plugin === "auto_mod") {
        if(!setting.warning_to_next) return true;
        if(!setting.mute_to_next) return true;
        if(!setting.kick_to_next) return true;
        if(!setting.tempban_to_next) return true;

        if(setting.chat_filter_enabled) {
            let chatFilter = JSON.parse(setting.chat_filter) || [];
            if(chatFilter.length === 0) return true;
            if(!setting.chat_filter_punishment) return true;
            if(setting.chat_filter_punishment) {
                if(setting.chat_filter_punishment !== "warning" 
                || setting.chat_filter_punishment !== "mute" 
                || setting.chat_filter_punishment !== "kick" 
                || setting.chat_filter_punishment !== "tempban" 
                || setting.chat_filter_punishment !== "ban") return true;
            }
        }

        if(setting.ping_filter_enabled) {
            if(!setting.number_of_pings_allowed) return true;
            if(!setting.ping_filter_punishment) return true;
            if(setting.chat_filter_punishment) {
                if(setting.ping_filter_punishment !== "warning" 
                || setting.ping_filter_punishment !== "mute" 
                || setting.ping_filter_punishment !== "kick" 
                || setting.ping_filter_punishment !== "tempban" 
                || setting.ping_filter_punishment !== "ban") return true;
            }
        }

        if(setting.spam_filter_enabled) {
            if(!setting.number_of_messages_allowed) return true;
            if(!setting.spam_filter_punishment) return true;
            if(setting.chat_filter_punishment) {
                if(setting.spam_filter_punishment !== "warning" 
                || setting.spam_filter_punishment !== "mute" 
                || setting.spam_filter_punishment !== "kick" 
                || setting.spam_filter_punishment !== "tempban" 
                || setting.spam_filter_punishment !== "ban") return true;
            }
        }

        if(setting.link_filter_enabled) {
            if(!setting.link_filter_punishment) return true;
            if(setting.link_filter_punishment) {
                if(setting.link_filter_punishment !== "warning" 
                || setting.link_filter_punishment !== "mute" 
                || setting.link_filter_punishment !== "kick" 
                || setting.link_filter_punishment !== "tempban" 
                || setting.link_filter_punishment !== "ban") return true;
            }
        }
    }

    //Logging
    if(plugin === "logging") {
        if(setting.mod_log_enabled) {
            let modLogChannel = guild.channels.cache.get(setting.mod_log_channel);
            if(!modLogChannel) return true;
        }

        if(module.message_log_enabled) {
            let messageLogChannel = guild.channels.cache.get(setting.message_log_channel);
            if(!messageLogChannel) return true;
        }

        if(module.invite_log_enabled) {
            let inviteLogChannel = guild.channels.cache.get(setting.invite_log_channel);
            if(!inviteLogChannel) return true;
        }

        if(module.jl_log_enabled) {
            let jlLogChannel = guild.channels.cache.get(setting.jl_log_channel);
            if(!jlLogChannel) return true;
        }
    }

    //Tickets
    if(plugin === "tickets") {
        let tsrDB = JSON.parse(setting.ticket_support_roles) || [];
        if(tsrDB.length === 0) return true;
        let ticketSupportRoles = guild.roles.cache.get(tsrDB);
        if(ticketSupportRoles === undefined) return true;

        let ticketCategory = guild.channels.cache.get(setting.ticket_category);
        if(!ticketCategory) return true;

        if(setting.ticket_channel_ping) {
            let tsprDB = JSON.parse(setting.ticket_ping_roles) || [];
            if(tsprDB.length === 0) return true;
            let ticketPingRoles = guild.roles.cache.get(tsprDB);
            if(!ticketPingRoles) return true;
        }

        if(!setting.ticket_message && !setting.ticket_embed_enabled) return true;

        return false;
    }
}