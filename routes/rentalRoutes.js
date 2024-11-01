const express = require('express');
const { createTransaction, addInsurance } = require('../controllers/rentalController');

const router = express.Router();

router.post('/rent', createTransaction);

router.post('/rent/insurance', addInsurance);

module.exports = router;
