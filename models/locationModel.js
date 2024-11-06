const axios = require('axios');
const MAPBOX_API_KEY = 'YOUR_MAPBOX_API_KEY';

exports.getDistance = async (origin, destination) => {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?access_token=${MAPBOX_API_KEY}`;
  
  try {
    const response = await axios.get(url);
    const distance = response.data.routes[0].distance / 1000; // Distance in kilometers
    return `${distance} km`;
  } catch (error) {
    throw new Error('Error calculating distance with Mapbox');
  }







};
