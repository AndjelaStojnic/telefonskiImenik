const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserProfile = sequelize.define('userProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  bio: {
    type: DataTypes.TEXT,
  },
  avatar: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'userProfiles',
  timestamps: false,
});

module.exports = UserProfile;
