const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SearchHistory = sequelize.define('searchHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  query: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'search_history',
  updatedAt: false,
});

module.exports = SearchHistory;
