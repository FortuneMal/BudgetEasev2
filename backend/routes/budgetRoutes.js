// backend/routes/budgetRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// @desc    Get all budgets for the authenticated user
// @route   GET /api/budgets
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    // Find budgets only for the logged-in user
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
}));

// @desc    Add a new budget for the authenticated user
// @route   POST /api/budgets
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
    const { category, limit, startDate, endDate } = req.body;

    if (!category || !limit || !endDate) {
        res.status(400);
        throw new Error('Please add all fields: category, limit, and end date');
    }

    const budget = await Budget.create({
        user: req.user._id, // Assign the budget to the logged-in user
        category,
        limit,
        startDate: startDate || Date.now(),
        endDate,
    });

    res.status(201).json(budget);
}));

// @desc    Update a budget for the authenticated user
// @route   PUT /api/budgets/:id
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
    const { category, limit, startDate, endDate } = req.body;

    const budget = await Budget.findById(req.params.id);

    if (!budget) {
        res.status(404);
        throw new Error('Budget not found');
    }

    // Make sure the logged-in user owns the budget
    if (budget.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this budget');
    }

    budget.category = category || budget.category;
    budget.limit = limit || budget.limit;
    budget.startDate = startDate || budget.startDate;
    budget.endDate = endDate || budget.endDate;

    const updatedBudget = await budget.save();
    res.json(updatedBudget);
}));

// @desc    Delete a budget for the authenticated user
// @route   DELETE /api/budgets/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
        res.status(404);
        throw new Error('Budget not found');
    }

    // Make sure the logged-in user owns the budget
    if (budget.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete this budget');
    }

    await budget.deleteOne(); // Use deleteOne()
    res.json({ message: 'Budget removed' });
}));

module.exports = router;

