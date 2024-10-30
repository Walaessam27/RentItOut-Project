const Item = require('../models/items'); 
const { Op } = require('sequelize');  

const searchItems = async (req, res) => {
    try {
        const { category, keyword } = req.query;

        
        const items = await Item.findAll({
            where: {
                category: category,
                description: {
                    [Op.iLike]: `%${keyword}%` 
                }
            }
        });

        res.json(items);  
    } catch (error) {
        res.status(500).json({ error: 'Error while searching for items' });
    }
};

module.exports = { searchItems };
