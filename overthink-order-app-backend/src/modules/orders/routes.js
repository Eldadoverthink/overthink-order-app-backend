const express = require('express');
const router = express.Router();
const Order = require('./model');

// Get all orders
router.get('/', async (req, res) => {
  const orders = await Order.findAll();
  res.json(orders);
});

// Create an order
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
