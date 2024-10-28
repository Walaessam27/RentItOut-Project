const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
<<<<<<< HEAD
    schema: 'public' 
});

module.exports = sequelize;

=======
    schema: process.env.DB_SCHEMA,  // استخدام المخطط الجديد
});

module.exports = sequelize;
>>>>>>> master
