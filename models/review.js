// models/review.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Review = sequelize.define('Review', {
    review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rental_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Rental', key: 'rental_id' },
        allowNull: false 
    },
    item_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Item', key: 'item_id' },
        allowNull: false
    },
    review: {
        type: DataTypes.TEXT,
        allowNull: false 
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false 
    }
}, {
    tableName: 'reviews',
    schema: 'new_rental',
    timestamps: false
});

module.exports = Review;
