const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');

const Customer = sequelize.define('Customer', {
  companyName: { type: DataTypes.STRING, allowNull: false },
  contactName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  phone: DataTypes.STRING,
  notes: DataTypes.TEXT,
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' }
});

module.exports = Customer;
