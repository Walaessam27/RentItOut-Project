const express = require('express');
const router = express.Router();
const RatingController = require('./controllers/RatingController');

// Route to PUT a new rating
router.put('/ratings', RatingController.addrate);

// Route to POST (update) an existing rating by ID
router.post('/ratings/:id', RatingController.updateRate);

// Route to GET (retrieve) an existing rating by ID
router.get('/ratings/:id', RatingController.getrate);


// Route to DELETE (delete) an existing rating by ID
router.delete('/ratings/:id', RatingController.deleterate);

module.exports = router;
