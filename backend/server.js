// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet'); // Import helmet
const rateLimit = require('express-rate-limit'); // Import rate-limit
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const goalRoutes = require('./routes/goalRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

// --- API Security Middleware ---

// 1. Helmet: Secure HTTP headers
app.use(helmet());

// 2. CORS: Restrict access to your frontend's production domain
// In production, replace 'http://localhost:5173' with your live frontend URL
const allowedOrigins = ['http://localhost:5173', 'https://www.your-live-frontend.com'];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));


// 3. Rate Limiting: Prevent brute-force and DoS attacks
// Apply to all requests to protect all routes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use(limiter);

// --- Core API Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

