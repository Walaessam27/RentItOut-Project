const express = require('express');
const router = express.Router();
const { searchItems } = require('../controllers/searchcon');

<<<<<<< HEAD

=======
>>>>>>> master
router.get('/search', searchItems);

module.exports = router;
