const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

const Item = sequelize.define('item', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // Rating should be between 1 and 5
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5, 
        },
    }
}, {
    tableName: 'item', 
    schema: 'public',
    timestamps: false 
});

module.exports = Item;
