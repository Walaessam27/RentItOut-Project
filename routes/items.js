const express = require('express');
const router = express.Router();
const { Item, Review } = require('../models');  

router.get('/', async (req, res) => {
    try {
        const items = await Item.findAll();
        res.json(items);
    } catch (error) {
        console.error("Error fetching items: ", error);  
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

router.put('/', async (req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error creating item: ", error);  
        res.status(500).json({ error: 'Failed to create item' });
    }
});

router.get('/:itemId/reviews', async (req, res) => {
    const { itemId } = req.params;

    try {
        console.log(`Fetching reviews for item ID: ${itemId}`); 
        
        const reviews = await Review.findAll({
            where: { item_id: itemId },
        });

        if (!reviews.length) {
            return res.status(404).json({ error: 'No reviews found for this item' });
        }

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error); 
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

module.exports = router;
