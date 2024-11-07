// routes/locationRoutes.js
const express = require('express');
const locationController = require('../controllers/locationController');

const router = express.Router();
router.get('/calculate-distance', locationController.calculateDistanceBetweenItemAndRental);

router.put('/items', locationController.createItemWithLocation);
router.put('/rentals', locationController.createRentalWithLocation);

router.post('/items/:itemId/location', locationController.updateItemLocation);
router.post('/rentals/:rentalId/location', locationController.updateRentalLocation);

router.delete('/items/:itemId', locationController.deleteItem);
router.delete('/rentals/:rentalId', locationController.deleteRental);

// route to test Mapbox API
router.get('/test-mapbox', locationController.testMapboxAPI);
//http://localhost:3000/test-mapbox

module.exports = router;
