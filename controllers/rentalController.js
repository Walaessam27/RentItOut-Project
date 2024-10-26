const Item = require('../models/item');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const Insurance = require('../models/insurance');

const createTransaction = async (req, res) => {
    try {
        const { item_id, renter_id, rental_start_date, rental_end_date } = req.body;
        

        const item = await Item.findByPk(item_id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        const owner = await User.findByPk(item.owner_id);
        if (!owner) return res.status(404).json({ error: 'Owner not found' });

        const rental_days = Math.ceil((new Date(rental_end_date) - new Date(rental_start_date)) / (1000 * 60 * 60 * 24));
        const total_price = item.price * rental_days;

        const commission = total_price * 0.10;

        const transaction = await Transaction.create({
            item_id,
            renter_id,
            rental_start_date,
            rental_end_date,
            total_price,
            commission
        });

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Error while creating transaction' });
    }
};

const addInsurance = async (req, res) => {
    try {
        const { transaction_id, insurance_fee, coverage_amount } = req.body;
        

        const transaction = await Transaction.findByPk(transaction_id);
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

      
        const insurance = await Insurance.create({
            transaction_id,
            insurance_fee,
            coverage_amount
        });

        res.json(insurance);
    } catch (error) {
        res.status(500).json({ error: 'Error while adding insurance' });
    }
};

module.exports = { createTransaction, addInsurance };
