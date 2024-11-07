const locationModel = require('../modules/locationModel');

exports.calculateDistance = async (req, res) => {
  const { origin, destination } = req.body;
  
  try {
    const distance = await locationModel.getDistance(origin, destination);
    res.json({ distance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = locationController;
