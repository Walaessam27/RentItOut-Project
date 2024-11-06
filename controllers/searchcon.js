const Item = require('../models/items');
const { Op } = require('sequelize');

const searchItems = async (req, res) => {
    try {
        const { category, keyword } = req.query;
        let whereCondition = {};     
        if (category) {
            whereCondition.category = category;
        }

        if (keyword) {
            whereCondition.description = {
                [Op.iLike]: `%${keyword}%`
            };
        }

        const items = await Item.findAll({
            where: whereCondition,
            attributes: ['category','name','description', 'price','quantity','availability','rating']  
                });

        res.json(items);  
    } catch (error) {
        console.error("Error during item search:", error);
        res.status(500).json({ error: 'Error while searching for items' });
    }
};

module.exports = { searchItems };
