const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Import customer routes
app.use('/api/customers', require('./modules/customers/routes'));
app.use('/api/orders', require('./modules/orders/routes'));

app.get('/', (req, res) => {
  res.send('Overthink Order-App backend is running!');
});

module.exports = app;
