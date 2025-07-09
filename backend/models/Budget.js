// backend/models/Budget.js
const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // Links to the User model
            required: true,
            ref: 'User', // Reference to the User model
        },
        category: {
            type: String,
            required: true,
            // A user should generally have one budget per category for a given period,
            // but unique: true here might be too restrictive if periods overlap.
            // For now, let's keep it as is, but be aware for future enhancements.
            // unique: true, // Removed unique constraint for now to avoid complexity with date ranges
            enum: ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Education', 'Other', 'Overall'], // 'Overall' for total budget
        },
        limit: { // The maximum amount budgeted for this category
            type: Number,
            required: true,
        },
        startDate: {
            type: Date, // Ensure this is explicitly Date type
            required: true,
        },
        endDate: {
            type: Date, // Ensure this is explicitly Date type
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;

