const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) return res.sendStatus(401); // Unauthorized if no token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user;
    next();
  });
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      // Differentiate between not authenticated and not authorized for role
      if (!req.user) return res.sendStatus(401); // Should be caught by authenticateToken first
      return res.sendStatus(403); // Forbidden for this role
    }
    next();
  };
}

module.exports = { authenticateToken, requireRole };
