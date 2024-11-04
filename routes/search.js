const express = require('express');
const router = express.Router();
const { searchItems } = require('../controllers/searchcon');

router.get('/search', searchItems);  // Ensure this endpoint is set up

module.exports = router;
