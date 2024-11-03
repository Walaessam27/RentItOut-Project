
const express = require('express');
const router = express.Router();
const Security = require('../models/Security');


router.post('/', async (req, res) => {
    try {
        const newRecord = await Security.create(req.body);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Security.update(req.body, {
            where: { security_id: req.params.id }
        });
        if (updated) {
            const updatedRecord = await Security.findByPk(req.params.id);
            res.status(200).json(updatedRecord);
        } else {
            res.status(404).json({ error: 'Record not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
