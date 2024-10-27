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
        references: { model: 'Item', key: 'item_id' }  // تأكد من أن اسم النموذج صحيح
    },
    renter_id: {
        type: DataTypes.INTEGER,
        references: { model: 'User', key: 'user_id' }  // تأكد من أن اسم النموذج صحيح
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
    }
}, {
    tableName: 'rental',
    schema: 'new_rental',  // استخدام المخطط المناسب
    timestamps: false
});

module.exports = Rental;
