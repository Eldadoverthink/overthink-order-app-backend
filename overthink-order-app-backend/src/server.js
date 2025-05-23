const app = require('./app');
const sequelize = require('../config/db');
const Customer = require('./modules/customers/model'); // This line is important for sequelize.sync() to know about the Customer model if it's not already loaded elsewhere.

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync(); // { force: true } for dev reset
    console.log('Database synchronized.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
})();
