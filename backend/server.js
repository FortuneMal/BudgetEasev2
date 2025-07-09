// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv'); // For environment variables
const connectDB = require('./config/db'); // Import the DB connection function

// backend/server.js (excerpt)
// ... (existing imports)
const currencyRoutes = require('./routes/currencyRoutes'); // Import currency routes

// ... (existing app.use for other routes)
app.use('/api/currency', currencyRoutes); // Use currency routes

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 3001; // Use port from .env or default to 3001

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Mock user data (will be replaced by DB users)
// const users = [
//     { id: 1, username: 'hannah', password: 'password123', name: 'Hannah' },
//     { id: 2, username: 'david', password: 'password123', name: 'David' },
// ];

// Import routes (we'll create these next)
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const goalRoutes = require('./routes/goalRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);

// Basic route for testing server
app.get('/', (req, res) => {
    res.send('BudgetEase API is running...');
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
