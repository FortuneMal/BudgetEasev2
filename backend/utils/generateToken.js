// backend/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // Uses the JWT_SECRET from your .env file
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

module.exports = generateToken;

