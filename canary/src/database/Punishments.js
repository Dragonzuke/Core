const { DataTypes, Model } = require('sequelize');

module.exports = class Case extends Model {
    static init(sequelize) {
        return super.init({
            case_number: { primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER },
            guild_id: { type: DataTypes.STRING },
            user_id: { type: DataTypes.STRING },
            staff_id: { type: DataTypes.STRING },
            type: { type: DataTypes.STRING },
            active: { type: DataTypes.BOOLEAN },
            expiration: { type: DataTypes.BIGINT },
            reason: { type: DataTypes.STRING },
            proof: { type: DataTypes.STRING },
        }, {
            tableName: 'punishments',
            sequelize
        });
    }
}