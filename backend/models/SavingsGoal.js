// backend/models/SavingsGoal.js
const mongoose = require('mongoose');

const savingsGoalSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        targetAmount: {
            type: Number,
            required: true,
        },
        savedAmount: {
            type: Number,
            default: 0,
        },
        targetDate: {
            type: Date,
            required: false, // Optional target date
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const SavingsGoal = mongoose.model('SavingsGoal', savingsGoalSchema);

module.exports = SavingsGoal;

