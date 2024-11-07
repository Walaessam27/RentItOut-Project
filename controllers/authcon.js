const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/user');

const register = async (req, res) => {
    const { name, phone_num, email, password, address, visa_num } = req.body;

    const phoneRegex = /^[0-9]{10,15}$/; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    if (!phoneRegex.test(phone_num)) {
        return res.status(400).json({ error: 'Phone number must be a numeric value between 10 to 15 digits.' });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email must be a valid email address.' });
    }

    if (!address || address.length === 0) {
        return res.status(400).json({ error: 'Address is required.' });
    }

    if (!visa_num || visa_num.length !== 16 || !/^\d+$/.test(visa_num)) {
        return res.status(400).json({ error: 'Visa number must be a 16-digit numeric value.' });
    }

    try {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { phone_num },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email or phone number already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, phone_num, email, password: hashedPassword, address, visa_num });
        res.status(201).json({ message: 'User created', userId: newUser.user_id });
    } catch (error) {
        console.error("Registration Error: ", error.message || error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(err => err.message) });
        }
        res.status(500).json({ error: 'Failed to register user' });
    }
};


const login = async (req, res) => {
    const { identifier, password } = req.body;

    // Validate inputs
    if (!identifier || !password) {
        return res.status(400).json({ error: 'Please provide both identifier (email/phone) and password.' });
    }

    try {
        // Look for the user by either phone_num or email
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { phone_num: identifier },
                    { email: identifier }
                ]
            }
        });

        // If user not found, return error
        if (!user) {
            console.log("User not found with identifier:", identifier);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log("Password mismatch for user:", user.email || user.phone_num);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create a JWT token with user information
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token as the response
        res.json({ token });
    } catch (error) {
        console.error("Login Error: ", error);
        res.status(500).json({ error: 'Failed to login' });
    }
};


const logout = (req, res) => {
    res.json({ message: 'Logged out' });
};

module.exports = { register, login, logout };







       // // External API call to fetch profile data
        // const externalApiUrl = `https://api.example.com/user-profile?email=${user.email}`;
        // const profileData = await axios.get(externalApiUrl);
               // res.json({ token, profile: profileData.data });