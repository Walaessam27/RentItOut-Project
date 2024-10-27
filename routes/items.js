const express = require('express');
const router = express.Router();
const Item = require('../models/item');

router.get('/', async (req, res) => {
    try {
        const items = await Item.findAll();
        res.json(items);
    } catch (error) {
        console.error("Error fetching items: ", error);  // تسجيل الخطأ
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error creating item: ", error);  // تسجيل الخطأ
        res.status(500).json({ error: 'Failed to create item' });
    }
});

module.exports = router;
