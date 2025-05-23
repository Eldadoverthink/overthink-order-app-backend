const app = require('./app');
const sequelize = require('../config/db');
const User = require('./modules/users/model');
const Customer = require('./modules/customers/model');
const Order = require('./modules/orders/model');

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
