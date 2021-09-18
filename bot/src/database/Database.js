const { Sequelize } = require('sequelize');
module.exports = new Sequelize('ZeroDay', 'root', 'Lightning', {
    dialect: 'mysql',
    logging: false,
    host: '192.168.0.22',
    port: '3306'
});