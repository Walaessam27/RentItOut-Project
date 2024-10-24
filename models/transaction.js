const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Transaction = sequelize.define('Transaction', {
    transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    item_id: {
        type: DataTypes.INTEGER,
        references: { model: 'item', key: 'item_id' },
        allowNull: false
    },
    renter_id: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'user_id' },
        allowNull: false
    },
    rental_start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    rental_end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    commission: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        defaultValue: 'pending'
    }
}, {
    tableName: 'transactions',
    schema: 'public',
    timestamps: false
});

module.exports = Transaction;
