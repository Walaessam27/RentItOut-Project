const express = require('express');
const router = express.Router();
const Item = require('../models/items');
const Review = require('../models/review'); 
const { createItem, getItems, getMyItems, updateItem, deleteItem } = require('../controllers/itemcon');
const authenticateToken = require('../middlewares/authMid');

router.use(authenticateToken);

router.get('/', getItems);


router.put('/', createItem);

router.post('/:id', updateItem);

router.delete('/:id', deleteItem);

router.get('/my-items', getMyItems);

router.get('/:itemId/reviews', async (req, res) => {
    const { itemId } = req.params;

    try {
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

router.post('/:itemId/reviews', async (req, res) => {
    const { itemId } = req.params;
    const { review, rating } = req.body;

    try {
        const newReview = await Review.create({
            item_id: itemId,
            review,
            rating,
        });

        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
});

router.put('/:itemId/reviews/:reviewId', authenticateToken, async (req, res) => {
    const { itemId, reviewId } = req.params;
    const { content, rating } = req.body; 

    try {
        const updatedReview = await Review.update(
            { content, rating }, 
            { where: { review_id: reviewId, item_id: itemId } } 
        );

        if (!updatedReview[0]) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.status(200).json({ message: 'Review updated successfully' });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
});

module.exports = router;
