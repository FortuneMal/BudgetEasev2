// backend/models/Goal.js
const mongoose = require('mongoose');

const goalSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Reference to the User model
        },
        name: {
            type: String,
            required: [true, 'Please add a goal name'],
        },
        targetAmount: {
            type: Number,
            required: [true, 'Please add a target amount'],
        },
        savedAmount: {
            type: Number,
            default: 0,
        },
        targetDate: {
            type: Date,
            required: [true, 'Please add a target date'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Goal', goalSchema);

