// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const goalRoutes = require('./routes/goalRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // Ensure this path is correct

dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // For URL-encoded data

// Enable CORS - IMPORTANT: In production, restrict origin to your frontend URL
app.use(cors());

// Define API routes
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/currency', currencyRoutes);

// Basic route for testing server
app.get('/', (req, res) => {
    res.send('BudgetEase API is running...');
});

// Custom error handling middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Backend server listening at http://localhost:${PORT}`);
});

