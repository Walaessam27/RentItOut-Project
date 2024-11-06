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
    email: {  
        type: DataTypes.STRING,
        allowNull: false,
        unique: noTrueLogging
    },
    password: DataTypes.STRING(100),
}, {
    tableName: 'users',
    schema: 'new_rental',  
    timestamps: false
});

module.exports = User;
