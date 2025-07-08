// backend/routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense'); // Import Expense model
// const protect = require('../middleware/authMiddleware'); // Future: Import auth middleware

// Middleware to protect routes (placeholder for now)
const protect = (req, res, next) => {
    // In a real app, this would verify a JWT token
    // For this demo, we'll just mock a user ID for now
    req.user = { _id: '60d5ec49f8c7d8001c8c8c8c' }; // Mock user ID for testing
    // You'll replace this with actual token verification and user extraction
    next();
};


// @desc    Get all expenses for a user
// @route   GET /api/expenses
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        // Find expenses belonging to the authenticated user
        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Server error fetching expenses' });
    }
});

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private
router.post('/', protect, async (req, res) => {
    const { amount, category, date, description } = req.body;

    if (!amount || !category) {
        return res.status(400).json({ message: 'Please enter amount and category' });
    }

    try {
        const expense = new Expense({
            user: req.user._id, // Assign to the authenticated user
            amount,
            category,
            date: date || Date.now(),
            description,
        });

        const createdExpense = await expense.save();
        res.status(201).json(createdExpense);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ message: 'Server error adding expense' });
    }
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { amount, category, date, description } = req.body;

    try {
        const expense = await Expense.findById(req.params.id);

        if (expense) {
            // Ensure the expense belongs to the authenticated user
            if (expense.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this expense' });
            }

            expense.amount = amount || expense.amount;
            expense.category = category || expense.category;
            expense.date = date || expense.date;
            expense.description = description || expense.description;

            const updatedExpense = await expense.save();
            res.json(updatedExpense);
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Server error updating expense' });
    }
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (expense) {
            // Ensure the expense belongs to the authenticated user
            if (expense.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this expense' });
            }

            await expense.deleteOne(); // Use deleteOne() for Mongoose 6+
            res.json({ message: 'Expense removed' });
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Server error deleting expense' });
    }
});

module.exports = router;

