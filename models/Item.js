const { DataTypes } = require('sequelize');
<<<<<<< HEAD
const sequelize = require('../db');
=======
const sequelize = require('../db');  // تأكد من استيراد sequelize من ملف db.js
>>>>>>> master

const Item = sequelize.define('Item', {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    availability: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    rating: DataTypes.DECIMAL(2, 1),
    category: DataTypes.STRING(50),
    location: DataTypes.STRING(255),
    owner_id: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'user_id' }
    },
    quantity: DataTypes.INTEGER
}, {
    tableName: 'item',
<<<<<<< HEAD
    schema: 'public',
=======
    schema: 'new_rental',  // تأكد من استخدام المخطط الصحيح
>>>>>>> master
    timestamps: false
});

module.exports = Item;
