const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');
const Group = require('./group');

const Contact = sequelize.define('contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prezime: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  brojTelefona: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slika: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  omiljeni: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  adresa: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postanskiBroj: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'contacts',
  timestamps: true, // uključujemo timestamps za istoriju promjena
});

Contact.belongsTo(User, { foreignKey: 'userId' });
Contact.belongsTo(Group, { foreignKey: 'groupId' });

module.exports = Contact;
