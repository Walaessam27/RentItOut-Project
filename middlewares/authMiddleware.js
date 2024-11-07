const jwt = require('jsonwebtoken'); // Use jsonwebtoken to decode and verify the token

// Middleware to verify Bearer token// Middleware to verify Bearer token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Extract the token

  if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).json({ message: 'Invalid token.' });
      }
      req.user = user; // Attach the user info to the request object
      next(); // Proceed to the next middleware or route handler
  });
}


module.exports = authenticateToken;
