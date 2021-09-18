const { DataTypes, Model } = require('sequelize');

module.exports = class Case extends Model {
    static init(sequelize) {
        return super.init({
            guild_id: { type: DataTypes.STRING },
            moderator_roles: { type: DataTypes.STRING },
            admin_roles: { type: DataTypes.STRING },
            member_role: { type: DataTypes.STRING },
            muted_role: { type: DataTypes.STRING },
        }, {
            tableName: 'settings',
            sequelize
        });
    }
}