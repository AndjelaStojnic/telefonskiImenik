const sequelize = require('../config/db'); // koristimo istu Sequelize instancu
const User = require('./user');
const Group = require('./group');
const Contact = require('./contact');
const CallHistory = require('./callHistory');
const UserProfile = require('./userProfile');
const SearchHistory = require('./searchHistory');
const Address = require('./address');

// Definiši relacije
User.hasMany(Contact);
Contact.belongsTo(User);

Group.hasMany(Contact);
Contact.belongsTo(Group);

async function syncDatabase() {
  await sequelize.sync({ alter: true }); // ili { force: true } ako želiš da brišeš stare tabele
}

module.exports = {
  sequelize,
  User,
  Group,
  Contact,
  CallHistory,
  UserProfile,
  SearchHistory,
  Address,
  syncDatabase,
};
