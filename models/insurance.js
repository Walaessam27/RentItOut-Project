const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Insurance = sequelize.define('Insurance', {
    insurance_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    transaction_id: {
        type: DataTypes.INTEGER,
        references: { model: 'transactions', key: 'transaction_id' },
        allowNull: false
    },
    insurance_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    coverage_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        defaultValue: 'active'
    }
}, {
    tableName: 'insurance',
    schema: 'public',
    timestamps: false
});

module.exports = Insurance;
