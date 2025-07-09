// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv'); // For environment variables
const connectDB = require('./config/db'); // Import the DB connection function

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// --- Initialize Express App (THIS MUST COME BEFORE app.use/get/post) ---
const app = express();
// --- End Initialization ---

const port = process.env.PORT || 3001; // Use port from .env or default to 3001

// Middleware (These must come after app is initialized)
app.use(bodyParser.json());
app.use(cors());

// Import routes (These must come after app is initialized)
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const goalRoutes = require('./routes/goalRoutes');
const currencyRoutes = require('./routes/currencyRoutes'); // Import currency routes

// Use routes (These must come after app is initialized and routes are imported)
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/currency', currencyRoutes); // Use currency routes

// Basic route for testing server
app.get('/', (req, res) => {
    res.send('BudgetEase API is running...');
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});

