// backend/routes/goalRoutes.js
const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal'); // <-- IMPORT THE GOAL MODEL
const protect = require('../middleware/authMiddleware');

// @desc    Get all goals for a user
// @route   GET /api/goals
// @access  Private
router.route('/')
    .get(protect, async (req, res) => {
        try {
            const goals = await Goal.find({ user: req.user._id }).sort({ targetDate: 1 });
            res.json(goals);
        } catch (error) {
            console.error('Error fetching goals:', error);
            res.status(500).json({ message: 'Server error fetching goals' });
        }
    })
    // @desc    Add a new goal
    // @route   POST /api/goals
    // @access  Private
    .post(protect, async (req, res) => {
        const { name, targetAmount, savedAmount, targetDate } = req.body;

        if (!name || !targetAmount || !targetDate) {
            return res.status(400).json({ message: 'Please add a name, target amount, and target date for the goal' });
        }

        try {
            const goal = new Goal({
                user: req.user._id,
                name,
                targetAmount,
                savedAmount: savedAmount || 0, // Default to 0 if not provided
                targetDate,
            });

            const createdGoal = await goal.save();
            res.status(201).json(createdGoal);
        } catch (error) {
            console.error('Error adding goal:', error);
            res.status(500).json({ message: 'Server error adding goal' });
        }
    });

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
router.route('/:id')
    .put(protect, async (req, res) => {
        const { name, targetAmount, savedAmount, targetDate } = req.body;

        try {
            const goal = await Goal.findById(req.params.id);

            if (goal) {
                // Ensure the logged-in user owns this goal
                if (goal.user.toString() !== req.user._id.toString()) {
                    return res.status(401).json({ message: 'Not authorized to update this goal' });
                }

                goal.name = name || goal.name;
                goal.targetAmount = targetAmount || goal.targetAmount;
                goal.savedAmount = savedAmount !== undefined ? savedAmount : goal.savedAmount;
                goal.targetDate = targetDate || goal.targetDate;

                const updatedGoal = await goal.save();
                res.json(updatedGoal);
            } else {
                res.status(404).json({ message: 'Goal not found' });
            }
        } catch (error) {
            console.error('Error updating goal:', error);
            res.status(500).json({ message: 'Server error updating goal' });
        }
    })
    // @desc    Delete a goal
    // @route   DELETE /api/goals/:id
    // @access  Private
    .delete(protect, async (req, res) => {
        try {
            const goal = await Goal.findById(req.params.id);

            if (goal) {
                // Ensure the logged-in user owns this goal
                if (goal.user.toString() !== req.user._id.toString()) {
                    return res.status(401).json({ message: 'Not authorized to delete this goal' });
                }

                await goal.deleteOne(); // Use deleteOne()
                res.json({ message: 'Goal removed' });
            } else {
                res.status(404).json({ message: 'Goal not found' });
            }
        } catch (error) {
            console.error('Error deleting goal:', error);
            res.status(500).json({ message: 'Server error deleting goal' });
        }
    });

module.exports = router;

