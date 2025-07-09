// backend/routes/goalRoutes.js
const express = require('express');
const router = express.Router();
const SavingsGoal = require('../models/SavingsGoal');
const protect = require('../middleware/authMiddleware'); // Import the real auth middleware

// Apply 'protect' middleware to all expense routes
router.route('/')
    .get(protect, async (req, res) => {
        try {
            const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
            res.json(expenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            res.status(500).json({ message: 'Server error fetching expenses' });
        }
    })
    .post(protect, async (req, res) => {
        const { amount, category, date, description } = req.body;
        // ... (rest of add expense logic)
    });

router.route('/:id')
    .put(protect, async (req, res) => {
        // ... (rest of update expense logic)
    })
    .delete(protect, async (req, res) => {
        // ... (rest of delete expense logic)
    });

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
