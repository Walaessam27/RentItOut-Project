const Item = require('../models/items');
const { Op } = require('sequelize');

const searchItems = async (req, res) => {
    try {
        const { category, keyword, minPrice, maxPrice, minRating, maxRating, availability, page = 1, limit = 10 } = req.query;

        let whereCondition = {}; 

    
        if (category) {
            whereCondition.category = {
                [Op.iLike]: `%${category}%`  
            };
        }

        
        if (keyword) {
            whereCondition.description = {
                [Op.iLike]: `%${keyword}%` 
            };
        }

       
        if (minPrice) {
            whereCondition.price = { [Op.gte]: minPrice };
        }
        if (maxPrice) {
            whereCondition.price = { ...whereCondition.price, [Op.lte]: maxPrice };
        }

       
        if (minRating) {
            whereCondition.rating = { [Op.gte]: minRating };
        }
        if (maxRating) {
            whereCondition.rating = { ...whereCondition.rating, [Op.lte]: maxRating };
        }

      
        if (availability !== undefined) {
            whereCondition.availability = availability === 'true';  
        }

        // Pagination logic
        const offset = (page - 1) * limit;

        const items = await Item.findAll({
            where: whereCondition,
            attributes: ['category', 'name', 'description', 'price', 'quantity', 'availability', 'rating'],
            limit: limit,       
            offset: offset      
        });

        if (items.length === 0) {
            let message = 'No items found matching your search criteria.';
            if (category && keyword) {
                message = `No items found in the "${category}" category with the keyword "${keyword}".`;
            } else if (category) {
                message = `No items found in the "${category}" category.`;
            } else if (keyword) {
                message = `No items found with the keyword "${keyword}".`;
            }

            return res.status(404).json({ message });
        }

        res.json({
            items,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalItems: await Item.count({ where: whereCondition }), // Total items matching the query
                totalPages: Math.ceil(await Item.count({ where: whereCondition }) / limit)
            }
        });

    } catch (error) {
        console.error("Error during item search:", error);
        res.status(500).json({ error: 'An error occurred while searching for items. Please try again later.' });
    }
};

module.exports = { searchItems };