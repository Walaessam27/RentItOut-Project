const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Rental = sequelize.define('Rental', {
    rental_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    item_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Item', key: 'item_id' } 
    },
    renter_id: {
        type: DataTypes.INTEGER,
        references: { model: 'User', key: 'user_id' }  
    },
    owner_id: {
        type: DataTypes.INTEGER,
        references: { model: 'User', key: 'user_id' }
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_from: {
        type: DataTypes.DATE,
        allowNull: false
    },
    date_to: {
        type: DataTypes.DATE,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    state: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    review: {  
        type: DataTypes.TEXT,
        allowNull: true
    },
    renter_email: {  
        type: DataTypes.STRING(100),
        allowNull: false  
    }
}, {
    tableName: 'rental',

    schema: process.env.DB_SCHEMA,  // استخدام المخطط المناسب

    timestamps: false
});

module.exports = Rental;

/*
const findRentalById = async (rentalId) => {
    return db('rentals').where({ id: rentalId }).first();
  };
  
  const updateRentalLocation = async (rentalId, location, latitude, longitude) => {
    const result = await db('rentals')
      .where({ id: rentalId })
      .update({ location, latitude, longitude })
      .returning('*');
    return result[0];
  };
  
  const deleteRental = async (rentalId) => {
    return db('rentals').where({ id: rentalId }).del();
  };
  
  module.exports = { createRental, findRentalById, updateRentalLocation, deleteRental };*/