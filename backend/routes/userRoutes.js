// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

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
            password, // Password will be hashed by the pre-save middleware
        });

        if (user) {
            // In a real app, you'd generate a JWT token here
            res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                message: 'User registered successfully'
                // token: generateToken(user._id) // Placeholder for JWT
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
            // Replace the mock login logic in server.js with this
            res.json({
                _id: user._id,
                name: user.name,
                username: user.username,
                // token: generateToken(user._id) // Placeholder for JWT
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requires authentication middleware)
// You would add an authentication middleware here to protect this route
router.get('/profile', async (req, res) => {
    // For now, let's assume a user ID is passed,
    // but normally this would come from a JWT token after authentication.
    // const user = await User.findById(req.user._id); // req.user would be set by auth middleware

    // For demo purposes, let's just return a placeholder
    res.json({ message: 'User profile data (requires authentication)' });
});

module.exports = router;

