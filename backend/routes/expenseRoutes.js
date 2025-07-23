// backend/routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// @desc    Get all expenses for the authenticated user
// @route   GET /api/expenses
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    // Find expenses only for the logged-in user (req.user._id comes from protect middleware)
    const expenses = await Expense.find({ user: req.user._id });
    res.json(expenses);
}));

// @desc    Add a new expense for the authenticated user
// @route   POST /api/expenses
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const { description, amount, category, date } = req.body;

    if (!description || !amount || !category) {
        res.status(400);
        throw new Error('Please add all fields: description, amount, category');
    }

    const expense = await Expense.create({
        user: req.user._id, // Assign the expense to the logged-in user
        description,
        amount,
        category,
        date: date || Date.now(),
    });

    res.status(201).json(expense);
}));

// @desc    Update an expense for the authenticated user
// @route   PUT /api/expenses/:id
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
    const { description, amount, category, date } = req.body;

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error('Expense not found');
    }

    // Make sure the logged-in user owns the expense
    if (expense.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this expense');
    }

    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
}));

// @desc    Delete an expense for the authenticated user
// @route   DELETE /api/expenses/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error('Expense not found');
    }

    // Make sure the logged-in user owns the expense
    if (expense.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this expense');
    }

    await expense.deleteOne(); // Use deleteOne()
    res.json({ message: 'Expense removed' });
}));

module.exports = router;

