// routes/payment.js
const express = require('express');
const router = express.Router();
const { Payment, Rental } = require('../models'); 

router.put('/', async (req, res) => {
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



router.get('/' ,  async (req, res) => {
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
router.post('/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { rentalId, renterId, paymentMethod, insuranceFee, totalAmount, notes } = req.body;

        console.log("Updating payment with values:", {
            rentalId,
            renterId,
            paymentMethod,
            insuranceFee,
            totalAmount,
            notes
        });

        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // Update payment information
        payment.rental_id = rentalId;
        payment.renter_id = renterId;
        payment.payment_method = paymentMethod;
        payment.insurance_fee = insuranceFee;
        payment.total_amount = totalAmount;
        payment.notes = notes;

        await payment.save();

        res.status(200).json(payment);
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ error: 'Failed to update payment' });
    }
});

// DELETE: Delete an existing payment
router.delete('/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;

        console.log("Deleting payment with ID:", paymentId);

        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        await payment.destroy();
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json({ error: 'Failed to delete payment' });
    }
});




module.exports = router;