const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');

const Order = sequelize.define('Order', {
  orderNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  product: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  price: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'), defaultValue: 'pending' }
});

module.exports = Order;
