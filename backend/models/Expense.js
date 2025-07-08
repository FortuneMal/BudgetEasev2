// backend/models/Expense.js
const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // Links to the User model
            required: true,
            ref: 'User', // Reference to the User model
        },
        amount: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
            // Example categories, you can expand this
            enum: ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Education', 'Other'],
        },
        date: {
            type: Date,
            default: Date.now, // Defaults to current date
        },
        description: {
            type: String,
            required: false,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
