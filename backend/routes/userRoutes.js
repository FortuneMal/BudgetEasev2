// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit'); // Import rate-limit

// Stricter rate limit for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Allow only 5 attempts per IP per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
});


// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', authLimiter, asyncHandler(async (req, res) => {
    const { name, username, password } = req.body;

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
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', authLimiter, asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
}));

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, asyncHandler(async (req, res) => {
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            username: req.user.username,
            currencyPreference: req.user.currencyPreference,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

// @desc    Delete a user and their associated data
// @route   DELETE /api/users/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
        res.status(404);
        throw new Error('User not found');
    }

    if (userToDelete._id.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this user');
    }

    await userToDelete.deleteOne();

    res.json({ message: 'User and all associated data removed successfully' });
}));

module.exports = router;

