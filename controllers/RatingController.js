const Rate = require('../models/RatingModels'); // Sequelize model for rating

class RatingController {
    // POST a new rating
    static async addrate(req, res) {
        const { user_id, item_id, rating } = req.body;

        // Check if rating is between 1 and 5
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating is required and must be between 1 and 5' });
        }

        try {
            const rate = await Rete.create({ user_id: user_id, item_id, rating });
            res.status(201).json({ message: 'Rate added', rate });
        } catch (error) {
            res.status(500).json({ error: 'Error adding Rate', details: error.message });
        }
    }

    // Update other controller methods if needed, here’s an example for updating feedback rating
    static async updateRate(req, res) {
        const { id } = req.params;
        const { rating } = req.body;

        // Check if rating is between 1 and 5
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating is required and must be between 1 and 5' });
        }

        try {
            const rate = await Rate.findByPk(id);
            if (!rate) {
                return res.status(404).json({ error: 'Rate not found' });
            }
            rate.rating = rating;
            await rate.save();
            res.json({ message: 'Rate updated', rate });
        } catch (error) {
            res.status(500).json({ error: 'Error updating Rate', details: error.message });
        }
    }
}

module.exports = RatingController;
