const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('telefonski_imenik', 'postgres', 'admin123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
  port: 5432,
});

module.exports = sequelize;
