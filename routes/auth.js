const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authcon');

router.post('/register', register);  // Endpoint for user registration
router.post('/login', login);          // Endpoint for user login
router.post('/logout', logout);        // Endpoint for user logout

module.exports = router;
