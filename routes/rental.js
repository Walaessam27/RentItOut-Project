const express = require('express');
const router = express.Router();
const { Rental, Item, Review } = require('../models');


const calculateTotalPrice = (pricePerDay, dateFrom, dateTo, quantity) => {
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    const rentalDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)); 
    return pricePerDay * rentalDays * quantity;
};

router.get('/', async (req, res) => {
    try {
        const rentals = await Rental.findAll();
        res.json(rentals);
    } catch (error) {
        console.error('Error fetching rentals:', error);
        res.status(500).json({ error: 'Failed to fetch rentals' });
    }
});

router.put('/rent', async (req, res) => {
    try {
        const { itemId, renterId, dateFrom, dateTo, quantity } = req.body;

        const item = await Item.findByPk(itemId);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        if (item.quantity < quantity) {
            return res.status(400).json({ error: 'Not enough quantity available' });
        }

        const totalPrice = calculateTotalPrice(item.price, dateFrom, dateTo, quantity);

        const rental = await Rental.create({
            item_id: itemId,
            renter_id: renterId,
            owner_id: item.owner_id,
            total_price: totalPrice,
            quantity,
            date_from: dateFrom,
            date_to: dateTo,
            location: item.location,
            state: 'pending'
        });

        await item.update({ quantity: item.quantity - quantity });

        res.status(201).json(rental);
    } catch (error) {
        console.error('Error while processing rental:', error);
        res.status(500).json({ error: 'Failed to process rental' });
    }
});

router.post('/update-rent', async (req, res) => {
    try {
        const { rentalId, newDateFrom, newDateTo, newQuantity } = req.body;

        const rental = await Rental.findByPk(rentalId);
        if (!rental) {
            return res.status(404).json({ error: 'Rental not found' });
        }

        const item = await Item.findByPk(rental.item_id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const quantityDifference = newQuantity - rental.quantity;
        if (item.quantity < quantityDifference) {
            return res.status(400).json({ error: 'Not enough quantity available for update' });
        }

        await item.update({ quantity: item.quantity - quantityDifference });

        const newTotalPrice = calculateTotalPrice(item.price, newDateFrom, newDateTo, newQuantity);

        await rental.update({
            date_from: newDateFrom,
            date_to: newDateTo,
            quantity: newQuantity,
            total_price: newTotalPrice
        });

        res.status(200).json(rental);
    } catch (error) {
        console.error('Error updating rental:', error);
        res.status(500).json({ error: 'Failed to update rental' });
    }
});


router.put('/review', async (req, res) => {
    try {
        const { rentalId, review } = req.body;

        const rental = await Rental.findByPk(rentalId);
        if (!rental) {
            return res.status(404).json({ error: 'Rental not found' });
        }

        await rental.update({ review });

        res.status(200).json({ message: 'Review updated successfully', rental });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
});


router.delete('/delete-rent/:rentalId', async (req, res) => {
    try {
        const { rentalId } = req.params;

        const rental = await Rental.findByPk(rentalId);
        if (!rental) {
            return res.status(404).json({ error: 'Rental not found' });
        }

        const item = await Item.findByPk(rental.item_id);
        if (item) {
            await item.update({ quantity: item.quantity + rental.quantity });
        }

        await rental.destroy();

        res.status(200).json({ message: 'Rental deleted successfully' });
    } catch (error) {
        console.error('Error deleting rental:', error);
        res.status(500).json({ error: 'Failed to delete rental' });
    }
});


module.exports = router;





















