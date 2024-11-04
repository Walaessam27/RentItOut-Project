const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone_num: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    visa_num: {
        type: DataTypes.STRING(16),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'no-email@example.com'
    }
}, {
    tableName: 'users',
    schema: 'public',
    timestamps: false
});

module.exports = User;
