const express = require('express');
const router = express.Router();
const { register, login, logout, profile} = require('../controllers/authcon');

router.post('/register', register); 
router.post('/login', login);       
router.get('/logout', logout);     
router.get('/profile', profile); 
module.exports = router;
