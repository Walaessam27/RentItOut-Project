const express = require('express');
const router = express.Router();
const Item = require('../models/items');
const { createItem, getItems,getMyItems, updateItem, deleteItem } = require('../controllers/itemcon');
const authenticateToken = require('../middlewares/authMid');

router.use(authenticateToken);

router.get('/', getItems); 
router.put('/', createItem);
router.post('/:id', updateItem);  
router.delete('/:id', deleteItem);  
router.get('/my-items', getMyItems);


module.exports = router;