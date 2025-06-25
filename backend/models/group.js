const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Group = sequelize.define('group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  naziv: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  opis: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'groups',
  timestamps: false,
});

module.exports = Group;
