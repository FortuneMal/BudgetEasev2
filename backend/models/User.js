// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: { // Using username for login, could also be email
            type: String,
            required: true,
            unique: true, // Ensures unique usernames
        },
        password: {
            type: String,
            required: true,
        },
        // Add other user-specific fields as needed (e.g., email, currency preference)
        currencyPreference: {
            type: String,
            default: 'USD', // Default currency
        }
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

// --- Password Hashing Middleware ---
// This will run before saving a user document
userSchema.pre('save', async function (next) {
    // Only hash if the password field is modified or is new
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
});

// --- Method to compare entered password with hashed password ---
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
