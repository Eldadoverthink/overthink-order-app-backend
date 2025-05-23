const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM('admin', 'customer'),
    allowNull: false,
    defaultValue: 'customer'
  }
});

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

// The User.hasOne(Customer) part of the association will be added
// in a subsequent step when the Customer model is updated,
// to avoid circular dependency issues during file creation.
// Sequelize will pick up both ends of the association once both models are defined
// and their relationship (User.hasOne <-> Customer.belongsTo) is declared.

module.exports = User;
