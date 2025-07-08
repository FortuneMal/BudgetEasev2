// backend/routes/goalRoutes.js
const express = require('express');
const router = express.Router();
const SavingsGoal = require('../models/SavingsGoal');
// const protect = require('../middleware/authMiddleware'); // Future: Import auth middleware

// Placeholder protect middleware (same as in expenseRoutes.js for now)
const protect = (req, res, next) => {
    req.user = { _id: '60d5ec49f8c7d8001c8c8c8c' }; // Mock user ID for testing
    next();
};

// @desc    Get all savings goals for a user
// @route   GET /api/goals
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const goals = await SavingsGoal.find({ user: req.user._id });
        res.json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ message: 'Server error fetching goals' });
    }
});

// @desc    Add a new savings goal
// @route   POST /api/goals
// @access  Private
router.post('/', protect, async (req, res) => {
    const { name, targetAmount, targetDate } = req.body;

    if (!name || !targetAmount) {
        return res.status(400).json({ message: 'Please provide goal name and target amount' });
    }

    try {
        const goal = new SavingsGoal({
            user: req.user._id,
            name,
            targetAmount,
            targetDate: targetDate || null,
        });

        const createdGoal = await goal.save();
        res.status(201).json(createdGoal);
    } catch (error) {
        console.error('Error adding goal:', error);
        res.status(500).json({ message: 'Server error adding goal' });
    }
});

// @desc    Update a savings goal
// @route   PUT /api/goals/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { name, targetAmount, savedAmount, targetDate, isCompleted } = req.body;

    try {
        const goal = await SavingsGoal.findById(req.params.id);

        if (goal) {
            if (goal.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this goal' });
            }

            goal.name = name || goal.name;
            goal.targetAmount = targetAmount || goal.targetAmount;
            goal.savedAmount = savedAmount !== undefined ? savedAmount : goal.savedAmount;
            goal.targetDate = targetDate || goal.targetDate;
            goal.isCompleted = isCompleted !== undefined ? isCompleted : goal.isCompleted;

            const updatedGoal = await goal.save();
            res.json(updatedGoal);
        } else {
            res.status(404).json({ message: 'Savings goal not found' });
        }
    } catch (error) {
        console.error('Error updating goal:', error);
        res.status(500).json({ message: 'Server error updating goal' });
    }
});

// @desc    Delete a savings goal
// @route   DELETE /api/goals/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const goal = await SavingsGoal.findById(req.params.id);

        if (goal) {
            if (goal.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this goal' });
            }

            await goal.deleteOne();
            res.json({ message: 'Savings goal removed' });
        } else {
            res.status(404).json({ message: 'Savings goal not found' });
        }
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ message: 'Server error deleting goal' });
    }
});

module.exports = router;
