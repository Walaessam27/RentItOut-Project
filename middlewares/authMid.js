const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log("JWT Secret:", process.env.JWT_SECRET);

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 
    if (!token) return res.status(401).json({ error: 'Authentication token is missing.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.sendStatus(403);
        }

        console.log('Decoded user:', user); 
        req.user = { userId: user.id, ...user }; 
        next(); 
    });
};
module.exports = authenticateToken;
