// backend/routes/budgetRoutes.js
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
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

// @desc    Get all budgets for a user
// @route   GET /api/budgets
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user._id });
        res.json(budgets);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ message: 'Server error fetching budgets' });
    }
});

// @desc    Add a new budget
// @route   POST /api/budgets
// @access  Private
router.post('/', protect, async (req, res) => {
    const { category, limit, startDate, endDate } = req.body;

    if (!category || !limit || !startDate || !endDate) {
        return res.status(400).json({ message: 'Please provide category, limit, start and end dates' });
    }

    try {
        const budget = new Budget({
            user: req.user._id,
            category,
            limit,
            startDate,
            endDate,
        });

        const createdBudget = await budget.save();
        res.status(201).json(createdBudget);
    } catch (error) {
        console.error('Error adding budget:', error);
        res.status(500).json({ message: 'Server error adding budget' });
    }
});

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { category, limit, startDate, endDate } = req.body;

    try {
        const budget = await Budget.findById(req.params.id);

        if (budget) {
            if (budget.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this budget' });
            }

            budget.category = category || budget.category;
            budget.limit = limit || budget.limit;
            budget.startDate = startDate || budget.startDate;
            budget.endDate = endDate || budget.endDate;

            const updatedBudget = await budget.save();
            res.json(updatedBudget);
        } else {
            res.status(404).json({ message: 'Budget not found' });
        }
    } catch (error) {
        console.error('Error updating budget:', error);
        res.status(500).json({ message: 'Server error updating budget' });
    }
});

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (budget) {
            if (budget.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this budget' });
            }

            await budget.deleteOne();
            res.json({ message: 'Budget removed' });
        } else {
            res.status(404).json({ message: 'Budget not found' });
        }
    } catch (error) {
        console.error('Error deleting budget:', error);
        res.status(500).json({ message: 'Server error deleting budget' });
    }
});

module.exports = router;
