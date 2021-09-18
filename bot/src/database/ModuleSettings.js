const { DataTypes, Model } = require('sequelize');

module.exports = class Case extends Model {
    static init(sequelize) {
        return super.init({
            guild_id: { type: DataTypes.STRING },
            
            security_days: { type: DataTypes.INTEGER },

            warning_to_next: { type: DataTypes.INTEGER },
            mute_to_next: { type: DataTypes.INTEGER },
            kick_to_next: { type: DataTypes.INTEGER },
            tempban_to_next: { type: DataTypes.INTEGER },

            chat_filter_enabled: { type: DataTypes.BOOLEAN },
            chat_filter: { type: DataTypes.STRING },
            chat_filter_punishment: { type: DataTypes.STRING },
            ping_filter_enabled: { type: DataTypes.BOOLEAN },
            number_of_pings_allowed: { type: DataTypes.INTEGER },
            ping_filter_punishment: { type: DataTypes.STRING },
            spam_filter_enabled: { type: DataTypes.BOOLEAN },
            number_of_messages_allowed: { type: DataTypes.INTEGER },
            spam_filter_punishment: { type: DataTypes.STRING },
            link_filter_enabled: { type: DataTypes.BOOLEAN },
            link_whitelist: { type: DataTypes.STRING },
            link_filter_punishment: { type: DataTypes.STRING },

            mod_log_enabled: { type: DataTypes.BOOLEAN },
            mod_log_channel: { type: DataTypes.STRING },
            message_log_enabled: { type: DataTypes.BOOLEAN },
            message_log_channel: { type: DataTypes.STRING },
            invite_log_enabled: { type: DataTypes.BOOLEAN },
            invite_log_channel: { type: DataTypes.STRING },
            jl_log_enabled: { type: DataTypes.BOOLEAN },
            jl_log_channel: { type: DataTypes.STRING },

            ticket_support_roles: { type: DataTypes.STRING },
            ticket_category: { type: DataTypes.STRING },
            ticket_channel_ping: { type: DataTypes.BOOLEAN },
            ticket_channel_ping_roles: { type: DataTypes.STRING },
            ticket_message: { type: DataTypes.STRING },
            ticket_embed_enabled: { type: DataTypes.BOOLEAN },
            ticket_embed_title: { type: DataTypes.STRING },
            ticket_embed_description: { type: DataTypes.STRING },
            ticket_embed_color: { type: DataTypes.STRING },
        }, {
            tableName: 'modulesettings',
            sequelize
        });
    }
}