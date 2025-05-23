const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');
const User = require('../users/model'); // Require User model for association

const Customer = sequelize.define('Customer', {
  companyName: { type: DataTypes.STRING, allowNull: false },
  contactName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false }, // Unique constraint removed as per user's script
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, 
    references: { model: 'Users', key: 'id' },
    onDelete: 'CASCADE'
  }
});

// Define Associations
Customer.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Customer, { foreignKey: 'userId', as: 'customer' });

module.exports = Customer;
