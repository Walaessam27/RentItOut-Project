const Item = require('../models/items');
const { Op } = require('sequelize');

const searchItems = async (req, res) => {
    try {
        const { category, keyword } = req.query;

        // Build the where clause conditionally
        let whereCondition = {};
        
        // Filter by category if provided
        if (category) {
            whereCondition.category = category;
        }

        // Filter by keyword in description if provided
        if (keyword) {
            whereCondition.description = {
                [Op.iLike]: `%${keyword}%`
            };
        }

        // Execute the search query with conditional filters
        const items = await Item.findAll({
            where: whereCondition
        });

        res.json(items);  
    } catch (error) {
        console.error("Error during item search:", error);
        res.status(500).json({ error: 'Error while searching for items' });
    }
};

module.exports = { searchItems };
