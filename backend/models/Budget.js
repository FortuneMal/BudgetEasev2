// backend/models/Budget.js
const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        category: {
            type: String,
            required: true,
            unique: true, // A user should generally have one budget per category
            enum: ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Education', 'Other', 'Overall'], // 'Overall' for total budget
        },
        limit: { // The maximum amount budgeted for this category
            type: Number,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
