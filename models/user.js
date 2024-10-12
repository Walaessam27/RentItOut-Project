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
    address: DataTypes.STRING(255),
    rating: DataTypes.DECIMAL(2, 1),
    password: DataTypes.STRING(255),
    visa_num: DataTypes.STRING(16)
}, {
    tableName: 'users',
    schema: 'public',
    timestamps: false
});

module.exports = User;
