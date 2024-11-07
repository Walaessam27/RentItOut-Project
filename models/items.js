const { DataTypes } = require('sequelize');
const sequelize = require('../db');  

const Item = sequelize.define('Item', {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },

    owner_email: {
        type: DataTypes.STRING(100), 
        allowNull: true
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
    rating: {
        type: DataTypes.DECIMAL(5, 1),
        allowNull: false,
        validate: {
            min: 1,
            max: 5, 
    }},
    category: DataTypes.STRING(50),
    location: DataTypes.STRING(255),
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' }
    },
    quantity: DataTypes.INTEGER
}, {
    tableName: 'item',

    schema: process.env.DB_SCHEMA,  // تأكد من استخدام المخطط الصحيح

    timestamps: false

   
});

module.exports = Item;


/*const findItemById = async (itemId) => {
  return db('items').where({ id: itemId }).first();
};

const updateItemLocation = async (itemId, location, latitude, longitude) => {
  const result = await db('items')
    .where({ id: itemId })
    .update({ location, latitude, longitude })
    .returning('*');
  return result[0];
};

const deleteItem = async (itemId) => {
  return db('items').where({ id: itemId }).del();
};

module.exports = { createItem, findItemById, updateItemLocation, deleteItem };*/