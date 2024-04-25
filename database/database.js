const Sequelize = require('sequelize');
const connection = new Sequelize('guiaperguntas', 'root', '123honorato', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

module.exports = connection;
