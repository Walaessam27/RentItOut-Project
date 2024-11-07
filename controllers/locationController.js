// controllers/locationController.js
const mapboxSdk = require('@mapbox/mapbox-sdk');
const itemModel = require('../models/itemModel');
const rentalModel = require('../models/rentalModel');

// Set up Mapbox client with your access token
const mapboxClient = mapboxSdk({ accessToken: 'YOUR_MAPBOX_ACCESS_TOKEN' });

// Function to get coordinates (latitude, longitude) from an address
const getCoordinatesFromAddress = async (address) => {
  try {
    const response = await mapboxClient.geocoding.forward(address, {
      limit: 1
    }).send();

    const features = response.body.features;
    if (features.length > 0) {
      const { center } = features[0]; // [longitude, latitude]
      return { latitude: center[1], longitude: center[0] };
    } else {
      throw new Error('No coordinates found for the given address');
    }
  } catch (error) {
    throw new Error(`Mapbox API error: ${error.message}`);
  }
};

// Controller to handle item creation
const createItemWithLocation = async (req, res) => {
  const { name, description, location } = req.body;

  try {
    const { latitude, longitude } = await getCoordinatesFromAddress(location);
    const newItem = await itemModel.createItem(name, description, location, latitude, longitude);

    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to handle rental creation
const createRentalWithLocation = async (req, res) => {
  const { itemId, renterName, rentalDate, location } = req.body;

  try {
    const { latitude, longitude } = await getCoordinatesFromAddress(location);
    const newRental = await rentalModel.createRental(itemId, renterName, rentalDate, location, latitude, longitude);

    res.status(201).json({ message: 'Rental created successfully', rental: newRental });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to calculate distance between item and rental
const calculateDistanceBetweenItemAndRental = async (req, res) => {
  const { itemId, rentalId } = req.body;

  try {
    const item = await itemModel.findItemById(itemId);
    const rental = await rentalModel.findRentalById(rentalId);

    if (!item || !rental) {
      return res.status(404).json({ error: 'Item or Rental not found' });
    }

    const distance = calculateDistance(
      item.latitude, item.longitude,
      rental.latitude, rental.longitude
    );

    res.json({ distance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update location for an item
const updateItemLocation = async (req, res) => {
  const { itemId, location } = req.body;

  try {
    const { latitude, longitude } = await getCoordinatesFromAddress(location);
    const updatedItem = await itemModel.updateItemLocation(itemId, location, latitude, longitude);

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item location updated successfully', item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update location for a rental
const updateRentalLocation = async (req, res) => {
  const { rentalId, location } = req.body;

  try {
    const { latitude, longitude } = await getCoordinatesFromAddress(location);
    const updatedRental = await rentalModel.updateRentalLocation(rentalId, location, latitude, longitude);

    if (!updatedRental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    res.json({ message: 'Rental location updated successfully', rental: updatedRental });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an item
const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const deleted = await itemModel.deleteItem(itemId);
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a rental
const deleteRental = async (req, res) => {
  const { rentalId } = req.params;

  try {
    const deleted = await rentalModel.deleteRental(rentalId);
    if (!deleted) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    res.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// controllers/locationController.js

// Test Mapbox API connection
const testMapboxAPI = async (req, res) => {
  try {
    const response = await mapboxClient.geocoding.forward('test address', {
      limit: 1
    }).send();

    if (response && response.body && response.body.features.length > 0) {
      res.json({ message: 'Mapbox API is working!', sampleCoordinates: response.body.features[0].center });
    } else {
      res.status(500).json({ error: 'Mapbox API did not return any features.' });
    }
  } catch (error) {
    res.status(500).json({ error: `Mapbox API error: ${error.message}` });
  }
};

module.exports = {
  createItemWithLocation,
  createRentalWithLocation,
  calculateDistanceBetweenItemAndRental,
  updateItemLocation,
  updateRentalLocation,
  deleteItem,
  deleteRental,
  testMapboxAPI
};
