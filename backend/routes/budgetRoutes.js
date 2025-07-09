// backend/routes/budgetRoutes.js
const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget'); // <-- IMPORT THE BUDGET MODEL
const protect = require('../middleware/authMiddleware');

// @desc    Get all budgets for a user
// @route   GET /api/budgets
// @access  Private
router.route('/')
    .get(protect, async (req, res) => {
        try {
            const budgets = await Budget.find({ user: req.user._id }).sort({ createdAt: -1 });
            res.json(budgets);
        } catch (error) {
            console.error('Error fetching budgets:', error);
            res.status(500).json({ message: 'Server error fetching budgets' });
        }
    })
    // @desc    Add a new budget
    // @route   POST /api/budgets
    // @access  Private
    .post(protect, async (req, res) => {
        const { category, limit } = req.body;

        if (!category || !limit) {
            return res.status(400).json({ message: 'Please add a category and a limit for the budget' });
        }

        try {
            const budget = new Budget({
                user: req.user._id,
                category,
                limit,
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
router.route('/:id')
    .put(protect, async (req, res) => {
        const { category, limit } = req.body;

        try {
            const budget = await Budget.findById(req.params.id);

            if (budget) {
                // Ensure the logged-in user owns this budget
                if (budget.user.toString() !== req.user._id.toString()) {
                    return res.status(401).json({ message: 'Not authorized to update this budget' });
                }

                budget.category = category || budget.category;
                budget.limit = limit || budget.limit;

                const updatedBudget = await budget.save();
                res.json(updatedBudget);
            } else {
                res.status(404).json({ message: 'Budget not found' });
            }
        } catch (error) {
            console.error('Error updating budget:', error);
            res.status(500).json({ message: 'Server error updating budget' });
        }
    })
    // @desc    Delete a budget
    // @route   DELETE /api/budgets/:id
    // @access  Private
    .delete(protect, async (req, res) => {
        try {
            const budget = await Budget.findById(req.params.id);

            if (budget) {
                // Ensure the logged-in user owns this budget
                if (budget.user.toString() !== req.user._id.toString()) {
                    return res.status(401).json({ message: 'Not authorized to delete this budget' });
                }

                await budget.deleteOne(); // Use deleteOne()
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

