const express = require('express');
const router = express.Router();
const { Security, Rental } = require('../models'); 


const calculateDamageFee = (itemValue, damagePercentage) => {
    return itemValue * (damagePercentage / 100);
};

router.get('/', async (req, res) => {
    try {
        const records = await Security.findAll(); 
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching security records' });
    }
});


router.post('/', async (req, res) => {
    try {
        const { rental_id, damage_percentage, notes } = req.body;

            console.log('Received data:', req.body);

        const rental = await Rental.findByPk(rental_id);
        if (!rental) {
            return res.status(404).json({ error: 'Rental not found' });
        }

        const damageFee = calculateDamageFee(rental.total_price, damage_percentage);

        const totalAmount = rental.total_price * 0.20 + 50.00 + damageFee;

        console.log('Damage fee:', damageFee);
        console.log('Total amount:', totalAmount);

        const newSecurity = await Security.create({
            rental_id,  
            security_deposit: rental.total_price * 0.20, 
            damage_protection_fee: 50.00,  
            damage_fee: damageFee,  
            damage_percentage, 
            notes,  
            total: totalAmount  
        });

        res.status(201).json(newSecurity);
    } catch (error) {
        console.error('Error creating security record:', error);
        res.status(500).json({ error: 'Error creating security record' });
    }
});


router.put('/', async (req, res) => {
    try {
        const { rental_id, damage_percentage, notes } = req.body;

        const rental = await Rental.findByPk(rental_id);
        if (!rental) {
            return res.status(404).json({ error: 'Rental not found' });
        }

        const damageFee = calculateDamageFee(rental.total_price, damage_percentage);

        const updatedSecurity = await Security.update(
            { 
                damage_fee: damageFee,
                damage_percentage,
                notes
            },
            { where: { rental_id: rental_id } }
        );

        if (updatedSecurity[0]) {
            const updatedRecord = await Security.findOne({ where: { rental_id: rental_id } });
            res.status(200).json(updatedRecord);
        } else {
            res.status(404).json({ error: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating security record' });
    }
});

router.delete('/', async (req, res) => {
    try {
        const { rental_id } = req.body;  

        const deleted = await Security.destroy({
            where: { rental_id: rental_id } 
        });

        if (deleted) {
            res.status(204).json({ message: 'Security record deleted successfully' });
        } else {
            res.status(404).json({ error: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting security record' });
    }
});

module.exports = router;
