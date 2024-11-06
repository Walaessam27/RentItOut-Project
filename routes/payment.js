const express = require('express');
const router = express.Router();
const { Payment, Rental } = require('../models');

router.put('/', async (req, res) => {
    try {
        const { rentalId, renterId, paymentMethod, insuranceFee, totalAmount, notes } = req.body;

        console.log("Updating payment with values:", {
            rentalId,
            renterId,
            paymentMethod,
            insuranceFee,
            totalAmount,
            notes
        });

        const rental = await Rental.findByPk(rentalId);
        if (!rental) {
            console.log('Rental not found'); 
            return res.status(404).json({ error: 'Rental not found' });
        }

        const payment = await Payment.update(
            { 
                renter_id: renterId,
                payment_method: paymentMethod,
                insurance_fee: insuranceFee,
                total_amount: totalAmount,
                notes
            },
            { where: { rental_id: rentalId } }
        );

        if (payment[0]) {
            const updatedPayment = await Payment.findOne({ where: { rental_id: rentalId } });
            res.status(200).json(updatedPayment);
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        console.error('Error updating payment:', error); 
        res.status(500).json({ error: 'Failed to update payment' });
    }
});


router.post('/', async (req, res) => {
    try {
        const { rentalId, renterId, paymentMethod, insuranceFee, totalAmount, notes } = req.body;

        console.log("Creating payment with values:", {
            rentalId,
            renterId,
            paymentMethod,
            insuranceFee,
            totalAmount,
            notes
        });

        const rental = await Rental.findByPk(rentalId);
        if (!rental) {
            console.log('Rental not found');
            return res.status(404).json({ error: 'Rental not found' });
        }

        const payment = await Payment.create({
            rental_id: rentalId,
            renter_id: renterId,
            payment_method: paymentMethod,
            insurance_fee: insuranceFee,
            total_amount: totalAmount,
            notes
        });

        res.status(201).json(payment);
    } catch (error) {
        console.error('Error creating payment:', error); 
        res.status(500).json({ error: 'Failed to create payment' });
    }
});


router.get('/', async (req, res) => {
    try {
        console.log("Fetching all payments...");
        const payments = await Payment.findAll();
        console.log("Payments fetched:", payments); 
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error); 
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});


router.delete('/', async (req, res) => {
    try {
        const { payment_id } = req.body;

        console.log(`Deleting payment with payment_id: ${payment_id}`);

        const deleted = await Payment.destroy({
            where: { payment_id }
        });

        if (deleted) {
            res.status(204).json({ message: 'Payment deleted successfully' });
        } else {
            res.status(404).json({ error: 'Payment not found' });
        }
    } catch (error) {
        console.error('Error deleting payment:', error); 
        res.status(500).json({ error: 'Failed to delete payment' });
    }
});


module.exports = router;
