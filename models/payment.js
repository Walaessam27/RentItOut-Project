const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Payment = sequelize.define('Payment', {
    payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rental_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Rental', key: 'rental_id' }
    },
    renter_id: {
        type: DataTypes.INTEGER,
        references: { model: 'User', key: 'user_id' }
    },
    payment_method: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    insurance_fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'payment',
    schema: 'rental',
    timestamps: false
});

module.exports = Payment;
