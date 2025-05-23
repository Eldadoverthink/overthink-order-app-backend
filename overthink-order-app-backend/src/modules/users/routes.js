const express = require('express');
const router = express.Router();
const User = require('./model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Register (optionally allow role, defaults to customer)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  // Only allow 'admin' or 'customer'. Default to 'customer'.
  let userRole = (role === 'admin' || role === 'customer') ? role : 'customer';
  try {
    const user = await User.create({ username, email, password, role: userRole });
    // Return user info without password
    res.status(201).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (err) {
    // Catch common Sequelize validation errors
    if (err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' }); 
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' } 
    );
    // Return user info along with token
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err); // Log the actual error on the server
    res.status(500).json({ error: 'An error occurred during login. Please try again later.' });
  }
});

module.exports = router;
