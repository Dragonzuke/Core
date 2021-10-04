const { DataTypes, Model } = require('sequelize');

module.exports = class Case extends Model {
    static init(sequelize) {
        return super.init({
            user_id: { type: DataTypes.STRING },
            acknowledgements: { type: DataTypes.STRING },
            global_level: { type: DataTypes.INTEGER },
        }, {
            tableName: 'users',
            sequelize
        });
    }
}