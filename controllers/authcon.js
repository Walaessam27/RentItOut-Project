const express = require('express');
const { auth } = require('express-openid-connect');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const axios = require('axios');
const User = require('../models/user');

const app = express();

app.use(express.json());
const config = {
    authRequired: false, 
    auth0Logout: true,
    secret: process.env.JWT_SECRET || 'my_own_pass_and_identity', 
       baseURL: 'http://localhost:3004', 
    clientID: 'beJNWxtAeEyAFhQozDd8OVro7uxiDXPS', 
    clientSecret: 'vQjKwlvZWBCboISlRViQMM9AwjWlqfsSLY-H8AgcPL03mWBmeUEIoLKov4AJci5a', 
    issuerBaseURL: 'https://your-issuer-url', 
    authorizationParams: {
        response_type: 'code',
        scope: 'openid profile email', 
    },
};

app.use(auth(config));

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
        
        res.status(201).json({
            message: 'User created',
            userId: newUser.user_id,
           
        });
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

    if (!identifier || !password) {
        return res.status(400).json({ error: 'Please provide both identifier (email/phone) and password.' });
    }

    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { phone_num: identifier },
                    { email: identifier }
                ]
            }
        });

        if (!user) {
            console.log("User not found with identifier:", identifier);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log("Password mismatch for user:", user.email || user.phone_num);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error("Login Error: ", error);
        res.status(500).json({ error: 'Failed to login' });
    }
};


const logout = (req, res) => {
    res.json({ message: 'Logged out' });
};

const profile = (req, res) => {

    if (!req.oidc || !req.oidc.isAuthenticated()) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    res.json(req.oidc.user);
};
module.exports = { register, login, logout, profile }; 

