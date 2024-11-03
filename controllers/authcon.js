const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (req, res) => {
    const { name, phone_num, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, phone_num, password: hashedPassword });
        res.status(201).json({ message: 'User created', userId: newUser.user_id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
};

const login = async (req, res) => {
    const { phone_num, password } = req.body;
    try {
        const user = await User.findOne({ where: { phone_num } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' });
    }
};

const logout = (req, res) => {
    // For token-based authentication, simply remove the token from the client-side.
    // Here you can implement session invalidation if using sessions.
    res.json({ message: 'Logged out' });
};

module.exports = { register, login, logout };
