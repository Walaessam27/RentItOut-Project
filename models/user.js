const bcrypt = require('bcryptjs');
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
<<<<<<< HEAD
    password: DataTypes.STRING(100),
}, {
    tableName: 'users',
    schema: 'new_rental',  
    timestamps: false
=======
    address: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: true,
        defaultValue: 3.0
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
    timestamps: false,

    // Define the beforeSave hook
    hooks: {
        beforeSave: async (user) => {
            if (user.password && user.password.length < 60) { // bcrypt hashes are 60 characters
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
>>>>>>> 7ad4b7df965949aa42e332d7060c13cfd82d77f2
});

module.exports = User;
