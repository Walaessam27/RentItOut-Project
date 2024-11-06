const Item = require('../models/items');

const createItem = async (req, res) => {
    const { name, description, price, availability, category, location, quantity } = req.body;

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const newItem = await Item.create({
            name,
            description,
            price,
            availability,
            category,
            location,
            owner_id: req.user.userId, 
            quantity
        });
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ error: 'Failed to create item' });
    }
};


const getItems = async (req, res) => {
    try {
        const filter = req.query.owner === 'true' ? { where: { owner_id: req.user.userId } } : {};
        const items = await Item.findAll(filter);
        res.json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};


const updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, availability, category, location, quantity } = req.body;

    try {
        const item = await Item.findByPk(id);

        if (!item) return res.status(404).json({ error: 'Item not found' });
        if (item.owner_id !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });

       
        item.name = name;
        item.description = description;
        item.price = price;
        item.availability = availability;
        item.category = category;
        item.location = location;
        item.quantity = quantity;
        
        await item.save();
        res.json(item);
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ error: 'Failed to update item' });
    }
};


const deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findByPk(id);
        
        if (!item) return res.status(404).json({ error: 'Item not found' });
        if (item.owner_id !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });

        await item.destroy();
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
};

const getMyItems = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

        
        const items = await Item.findAll({
            where: {
                owner_id: req.user.userId 
            }
        });

        res.json(items);
    } catch (error) {
        console.error("Error fetching user's items: ", error);
        res.status(500).json({ error: 'Failed to fetch user items' });
    }
};

module.exports = { createItem, getItems,getMyItems, updateItem, deleteItem };