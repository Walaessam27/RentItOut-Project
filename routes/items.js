const express = require('express');
const router = express.Router();
const Item = require('../models/items');
const { createItem, getItems } = require('../controllers/itemcon');
const authenticateToken = require('../middlewares/authMid');

router.use(authenticateToken);

router.get('/', getItems); 
router.post('/', createItem); 

module.exports = router;