
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Security = sequelize.define('Security', {
    security_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    security_deposit: {  
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false
    },
    damage_protection_fee: {  
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false
    }
}, {
    tableName: 'security',
    schema: 'rental', 
    timestamps: false
});

module.exports = Security;
