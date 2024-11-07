const Item = require('../models/items');
const User = require('../models/user'); 

const createItem = async (req, res) => {
    const { name, description, price, availability, category, location, quantity } = req.body;

    if (!name || !description || !price || !availability || !category || !location || !quantity) {
        console.warn('Missing required fields for item creation');
        return res.status(400).json({
            error: 'Missing required fields. Please provide name, description, price, availability, category, location, and quantity.'
        });
    }

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const owner = await User.findByPk(req.user.userId);

        if (!owner) {
            return res.status(404).json({ error: 'Owner not found' });
        }

        const newItem = await Item.create({
            name,
            description,
            price,
            availability,
            category,
            location,
            quantity,
            owner_id: req.user.userId, 
            owner_email: owner.email   
                });

        console.log(`Item created successfully with owner email: ${owner.email}`);
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error creating item:", error.message);
        res.status(500).json({ error: 'Failed to create item' });
    }
};

module.exports = { createItem };

const getItems = async (req, res) => {
    try {
        const filter = req.query.owner === 'true' ? { where: { owner_id: req.user.userId } } : {};
        const items = await Item.findAll(filter);
        
        if (items.length === 0) {
            console.warn("No items found.");
        } else {
            console.log(`Found ${items.length} items.`);
        }
        
        res.json(items);
    } catch (error) {
        console.error("Error fetching items:", error.message);
        res.status(500).json({ error: 'Failed to fetch items. Please try again later.' });
    }
};


const updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, availability, category, location, quantity } = req.body;

    try {
        const item = await Item.findByPk(id);

        if (!item) {
            console.warn(`Item with ID ${id} not found for update.`);
            return res.status(404).json({ error: 'Item not found' });
        }

        if (item.owner_id !== req.user.userId) {
            console.warn(`Unauthorized update attempt on item ID ${id} by user ID ${req.user.userId}.`);
            return res.status(403).json({
                error: `Access denied. You do not own item ID ${id}, so you cannot modify it.`
            });
        }

       
        if (name !== undefined) item.name = name;
        if (description !== undefined) item.description = description;
        if (price !== undefined) item.price = price;
        if (availability !== undefined) item.availability = availability;
        if (category !== undefined) item.category = category;
        if (location !== undefined) item.location = location;
        if (quantity !== undefined) item.quantity = quantity;

        await item.save();
        console.log(`Item with ID ${id} updated successfully.`);
        res.json(item);
    } catch (error) {
        console.error("Error updating item:", error.message);
        res.status(500).json({ error: 'Failed to update item. Please try again.' });
    }
};

const Rental = require('../models/rental'); 

const deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findByPk(id);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        if (item.owner_id !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized: You do not have access to delete this item.' });
        }

        await Rental.destroy({ where: { item_id: id } });
        await item.destroy();

        res.json({ message: 'Item and associated rentals deleted successfully' });
    } catch (error) {
        console.error("Error deleting item and rentals:", error);
        res.status(500).json({ error: 'Failed to delete item and rentals' });
    }
};

module.exports = { deleteItem };



const getMyItems = async (req, res) => {
    try {
        if (!req.user) {
            console.error('Unauthorized access attempt in getMyItems.');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        console.log('Fetching items for user:', req.user.userId);

        const items = await Item.findAll({
            where: {
                owner_id: req.user.userId
            }
        });

        if (items.length === 0) {
            console.warn(`No items found for user ID ${req.user.userId}.`);
        } else {
            console.log(`Found ${items.length} items for user ID ${req.user.userId}.`);
        }

        res.json(items);
    } catch (error) {
        console.error("Error fetching user's items:", error.message);
        res.status(500).json({ error: 'Failed to fetch user items. Please try again later.' });
    }
};

module.exports = { createItem, getItems, getMyItems, updateItem, deleteItem };




