const { DataTypes, Model } = require('sequelize');

module.exports = class Case extends Model {
    static init(sequelize) {
        return super.init({
            guild_id: { type: DataTypes.STRING },
            security: { type: DataTypes.BOOLEAN },
            moderation: { type: DataTypes.BOOLEAN },
            automod: { type: DataTypes.BOOLEAN },
            auditlog: { type: DataTypes.BOOLEAN },
            tickets: { type: DataTypes.BOOLEAN },
        }, {
            tableName: 'modules',
            sequelize
        });
    }
}