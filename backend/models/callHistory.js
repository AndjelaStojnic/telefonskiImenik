const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');
const Contact = require('./contact');

const CallHistory = sequelize.define('callHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contactId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipPoziva: {
    type: DataTypes.ENUM('dolazni', 'odlazni', 'promašen'),
    allowNull: false,
  },
  datumVreme: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  trajanjeSekunde: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'call_history',
  timestamps: false,
});

CallHistory.belongsTo(User, { foreignKey: 'userId' });
CallHistory.belongsTo(Contact, { foreignKey: 'contactId' });

module.exports = CallHistory;
