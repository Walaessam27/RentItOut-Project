// models/security.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Security = sequelize.define('Security', {
    security_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rental_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'rental',
            key: 'rental_id'
        },
        allowNull: false
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
    },
    damage_fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false
    },
    damage_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0.00,
        allowNull: true
    },
    notes: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    total: {  
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        allowNull: false
    }
}, {
    tableName: 'security',
    schema:process.env.DB_SCHEMA,
    timestamps: false
});


Security.associate = (models) => {
    Security.belongsTo(models.Rental, {
        foreignKey: 'rental_id',
        targetKey: 'rental_id'
    });
};

module.exports = Security;
