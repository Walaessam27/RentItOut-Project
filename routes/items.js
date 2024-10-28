const express = require('express');
const router = express.Router();
const Item = require('../models/item');

router.get('/', async (req, res) => {
    try {
        const items = await Item.findAll();
        res.json(items);
    } catch (error) {
<<<<<<< HEAD
=======
        console.error("Error fetching items: ", error);  // تسجيل الخطأ
>>>>>>> master
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
<<<<<<< HEAD
=======
        console.error("Error creating item: ", error);  // تسجيل الخطأ
>>>>>>> master
        res.status(500).json({ error: 'Failed to create item' });
    }
});

module.exports = router;
