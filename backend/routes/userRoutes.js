// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model
const generateToken = require('../utils/generateToken'); // Import generateToken
const asyncHandler = require('express-async-handler'); // For simplified async error handling

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
    const { name, username, password } = req.body;

    // Basic validation
    if (!name || !username || !password) {
        res.status(400);
        throw new Error('Please enter all fields: name, username, and password');
    }

    const userExists = await User.findOne({ username });

    if (userExists) {
        res.status(400);
        throw new Error('User with this username already exists');
    }

    const user = await User.create({
        name,
        username,
        password, // Password will be hashed by the pre-save middleware in User.js
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            token: generateToken(user._id), // Generate and send token
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            token: generateToken(user._id), // Generate and send token
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
}));

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requires authentication middleware)
// This route would typically be protected by the 'protect' middleware
// For now, it's a placeholder, but in a real app, req.user would come from JWT
router.get('/profile', asyncHandler(async (req, res) => {
    // This route would be protected by the 'protect' middleware
    // For now, let's just return a placeholder or mock data if not protected
    res.json({ message: 'User profile data (requires authentication)' });
}));

module.exports = router;

