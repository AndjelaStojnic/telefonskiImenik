const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  lozinka: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailVerified: {  // Polje za verifikaciju mejla
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'users',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.lozinka) {
        user.lozinka = await bcrypt.hash(user.lozinka, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('lozinka')) {
        user.lozinka = await bcrypt.hash(user.lozinka, 10);
      }
    },
  }
});

// Metod za proveru lozinke
User.prototype.proveriLozinku = async function (lozinka) {
  return await bcrypt.compare(lozinka, this.lozinka);
};

module.exports = User;
