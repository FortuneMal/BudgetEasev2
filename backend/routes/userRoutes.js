// backend/routes/userRoutes.js (excerpt)
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/generateToken'); // Import generateToken

// ... (rest of the file)

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, username, password } = req.body;

    try {
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'User with this username already exists' });
        }

        const user = await User.create({
            name,
            username,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                // Send token upon successful registration
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                username: user.username,
                // Send token upon successful login
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;
