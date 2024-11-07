const { DataTypes } = require('sequelize');
const sequelize = require('../db');  

const Item = sequelize.define('Item', {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    owner_email: {
        type: DataTypes.STRING(100), 
        allowNull: true
    },

    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    review: { // الحقل الجديد للمراجعة
        type: DataTypes.TEXT,
        allowNull: true
    },

    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    availability: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    rating:{ 
        type: DataTypes.DECIMAL(2, 1),   
         defaultValue: 3.0},
    category: DataTypes.STRING(50),
    location: DataTypes.STRING(255),
    owner_id: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'user_id' }
    },
    quantity: DataTypes.INTEGER
}, {
    tableName: 'item',

    schema: 'new_rental',  // تأكد من استخدام المخطط الصحيح

    timestamps: false

   
});

module.exports = Item;
