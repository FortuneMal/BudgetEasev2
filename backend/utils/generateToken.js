// backend/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // Ensure JWT_SECRET is set in your backend/.env file
    // e.g., JWT_SECRET=your_super_secret_jwt_key_here
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

module.exports = generateToken;

