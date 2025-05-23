const express = require('express');
const router = express.Router();
const Customer = require('./model');
const { authenticateToken, requireRole } = require('../../middleware/auth');

// ADMIN: Get all customers
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (err) {
    console.error('Error fetching all customers:', err);
    res.status(500).json({ error: 'Failed to retrieve customers.' });
  }
});

// ADMIN: Get a single customer by ID
router.get('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
        return res.status(400).json({ error: 'Invalid customer ID format.' });
    }
    const customer = await Customer.findByPk(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found.' });
    res.json(customer);
  } catch (err) {
    console.error(`Error fetching customer ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to retrieve customer.' });
  }
});

// ADMIN: Create a new customer
router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    // Admin should provide userId when creating a customer profile
    if (!req.body.userId) {
        return res.status(400).json({ error: 'userId is required to link customer to a user.' });
    }
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    console.error('Error creating customer:', err);
    res.status(400).json({ error: 'Failed to create customer.' });
  }
});

// ADMIN: Update a customer by ID
router.put('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
        return res.status(400).json({ error: 'Invalid customer ID format.' });
    }
    const customer = await Customer.findByPk(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found.' });
    
    // Prevent changing userId if it's already set, to avoid accidental re-association.
    // If re-association is a feature, it needs more careful handling.
    if (req.body.userId && req.body.userId !== customer.userId) {
        return res.status(400).json({ error: 'Cannot change the userId of an existing customer record via this route.' });
    }

    await customer.update(req.body);
    res.json(customer);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    console.error(`Error updating customer ${req.params.id}:`, err);
    res.status(400).json({ error: 'Failed to update customer.' });
  }
});

// ADMIN: Delete a customer by ID
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const customerId = parseInt(req.params.id, 10);
    if (isNaN(customerId)) {
        return res.status(400).json({ error: 'Invalid customer ID format.' });
    }
    const customer = await Customer.findByPk(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found.' });
    await customer.destroy();
    res.json({ message: 'Customer deleted successfully.' });
  } catch (err) {
    console.error(`Error deleting customer ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to delete customer.' });
  }
});

// CUSTOMER: Get their own customer record
router.get('/me', authenticateToken, requireRole('customer'), async (req, res) => {
  try {
    const customer = await Customer.findOne({ where: { userId: req.user.id } });
    if (!customer) return res.status(404).json({ error: 'Customer record not found for this user.' });
    res.json(customer);
  } catch (err) {
    console.error(`Error fetching 'me' record for user ${req.user.id}:`, err);
    res.status(500).json({ error: 'Failed to retrieve your customer record.' });
  }
});

// CUSTOMER: Update their own customer record
router.put('/me', authenticateToken, requireRole('customer'), async (req, res) => {
  try {
    // Prevent customer from changing their own userId via this route
    const { userId, ...updateData } = req.body; 
    if (userId && userId !== req.user.id) { // Check if userId is in body and different
        return res.status(403).json({ error: 'Operation not allowed: Cannot change associated user ID.' });
    }

    const customer = await Customer.findOne({ where: { userId: req.user.id } });
    if (!customer) return res.status(404).json({ error: 'Customer record not found for this user.' });
    
    await customer.update(updateData);
    res.json(customer);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    console.error(`Error updating 'me' record for user ${req.user.id}:`, err);
    res.status(400).json({ error: 'Failed to update your customer record.' });
  }
});

module.exports = router;
