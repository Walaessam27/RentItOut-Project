const Item = require('../models/items');

const createItem = async (req, res) => {
    const { name, description, price, availability, category, location, quantity } = req.body;

    // Check if the user is the owner (this would typically be part of a more complex ownership check)
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const newItem = await Item.create({
            name,
            description,
            price,
            availability,
            category,
            location,
            owner_id: req.user.userId, // Set the owner ID from the logged-in user
            quantity
        });
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error creating item: ", error);
        res.status(500).json({ error: 'Failed to create item' });
    }
};

const getItems = async (req, res) => {
    try {
        const items = await Item.findAll();
        res.json(items);
    } catch (error) {
        console.error("Error fetching items: ", error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

module.exports = { createItem, getItems };
