    // backend/models/Budget.js
    const mongoose = require('mongoose');

    const budgetSchema = mongoose.Schema(
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User', // Reference to the User model
            },
            category: {
                type: String,
                required: [true, 'Please add a category'],
                // This 'unique: false' here is a bit misleading if you also have a compound index.
                // The actual uniqueness is enforced by the compound index below.
                unique: false,
            },
            limit: {
                type: Number,
                required: [true, 'Please add a limit'],
            },
            startDate: {
                type: Date,
                default: Date.now,
            },
            endDate: {
                type: Date,
                required: [true, 'Please add an end date'],
            },
        },
        {
            timestamps: true,
        }
    );

    // Add a unique compound index to ensure a user cannot have two budgets for the same category
    // This is the index that's causing your error when a duplicate category is attempted for the same user.
    budgetSchema.index({ user: 1, category: 1 }, { unique: true });

    module.exports = mongoose.model('Budget', budgetSchema);
    
