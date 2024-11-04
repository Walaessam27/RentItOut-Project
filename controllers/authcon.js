const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/user');

const register = async (req, res) => {
    const { name, phone_num, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, phone_num, email, password: hashedPassword });
        res.status(201).json({ message: 'User created', userId: newUser.user_id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
};

const login = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { phone_num: identifier },
                    { email: identifier }
                ]
            }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // External API call to fetch profile data
        const externalApiUrl = `https://api.example.com/user-profile?email=${user.email}`;
        const profileData = await axios.get(externalApiUrl);

        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, profile: profileData.data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
};

const logout = (req, res) => {
    res.json({ message: 'Logged out' });
};

module.exports = { register, login, logout };
