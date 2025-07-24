// backend/routes/goalRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Goal = require('../models/Goal'); // Assuming your model is named Goal.js
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// @desc    Get all goals for the authenticated user
// @route   GET /api/goals
// @access  Private
router.route('/')
    .get(protect, asyncHandler(async (req, res) => {
        // Find goals only for the logged-in user
        const goals = await Goal.find({ user: req.user._id }).sort({ targetDate: 1 });
        res.json(goals);
    }))
    // @desc    Add a new goal for the authenticated user
    // @route   POST /api/goals
    // @access  Private
    .post(protect, asyncHandler(async (req, res) => {
        const { name, targetAmount, savedAmount, targetDate } = req.body;

        if (!name || !targetAmount || !targetDate) {
            res.status(400);
            throw new Error('Please add a name, target amount, and target date for the goal');
        }

        const goal = await Goal.create({
            user: req.user._id, // Assign the goal to the logged-in user
            name,
            targetAmount,
            savedAmount: savedAmount || 0,
            targetDate,
        });

        res.status(201).json(goal);
    }));

// @desc    Update a goal for the authenticated user
// @route   PUT /api/goals/:id
// @access  Private
router.route('/:id')
    .put(protect, asyncHandler(async (req, res) => {
        const { name, targetAmount, savedAmount, targetDate } = req.body;

        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            res.status(404);
            throw new Error('Goal not found');
        }

        // Make sure the logged-in user owns the goal
        if (goal.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this goal');
        }

        goal.name = name || goal.name;
        goal.targetAmount = targetAmount !== undefined ? targetAmount : goal.targetAmount;
        goal.savedAmount = savedAmount !== undefined ? savedAmount : goal.savedAmount;
        goal.targetDate = targetDate || goal.targetDate;

        const updatedGoal = await goal.save();
        res.json(updatedGoal);
    }))
    // @desc    Delete a goal for the authenticated user
    // @route   DELETE /api/goals/:id
    // @access  Private
    .delete(protect, asyncHandler(async (req, res) => {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            res.status(404);
            throw new Error('Goal not found');
        }

        // Make sure the logged-in user owns the goal
        if (goal.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this goal');
        }

        await goal.deleteOne();
        res.json({ message: 'Goal removed' });
    }));

module.exports = router;

