const express = require('express');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase Client
// Note: In production, strictly use environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// SECURITY & RELIABILITY MIDDLEWARE (ELEVATED)
// ==========================================

// 1. Helmet: Sets secure HTTP headers to protect against common web vulnerabilities
app.use(helmet());

// 2. Body Parser & CORS
app.use(express.json({ limit: '10kb' })); // Restrict payload size
app.use(cors());

// 3. Rate Limiting: Prevents brute-force and DDoS attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, 
  legacyHeaders: false, 
  message: { success: false, error: 'Too many requests originating from this IP, please try again after 15 minutes' }
});

// Apply rate limiting specifically to authentication routes
app.use('/api/auth/', apiLimiter);

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================
async function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token, authorization denied' });
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) {
      return next(error); // Pass to global error handler
    }
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
}

// ==========================================
// ROUTES (Now powered by Supabase)
// ==========================================

// User Registration
app.post('/api/auth/register',
  [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    
    const { email, password } = req.body;
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return next(error);
      
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
);

// User Login
app.post('/api/auth/login', 
  [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { email, password } = req.body;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return next(error);
      
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
});

// Get user expenses
app.get('/api/expenses', auth, async (req, res, next) => {
  try {
    const { category, sort, search } = req.query;
    
    let query = supabase
      .from('expenses')
      .select('*')
      .eq('user_id', req.user.id);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    
    if (search) {
      // Supabase ilike operator for case-insensitive search
      query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%`);
    }

    if (sort === 'date_desc') {
      query = query.order('created_at', { ascending: false });
    } else if (sort === 'amount_desc') {
      query = query.order('amount', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) return next(error);
    
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// Add a new expense
app.post('/api/expenses', auth, 
  [
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('amount', 'Amount is required and must be numeric').isNumeric(),
    check('category', 'Category is required').not().isEmpty().trim().escape()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, amount, category, isRecurring } = req.body;
    try {
      const newExpense = {
        user_id: req.user.id,
        name,
        amount: parseFloat(amount),
        category,
        isRecurring: !!isRecurring
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert([newExpense])
        .select();

      if (error) return next(error);
      
      res.status(201).json({ success: true, data: data[0] });
    } catch (err) {
      next(err);
    }
});

// Update an expense
app.put('/api/expenses/:id', auth, 
  [
    check('name', 'Name is required').optional().not().isEmpty().trim().escape(),
    check('amount', 'Amount must be numeric').optional().isNumeric(),
    check('category', 'Category is required').optional().not().isEmpty().trim().escape()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, amount, category, isRecurring } = req.body;
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (amount) updatedFields.amount = parseFloat(amount);
    if (category) updatedFields.category = category;
    if (isRecurring !== undefined) updatedFields.isRecurring = !!isRecurring;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(updatedFields)
        .eq('id', req.params.id)
        .eq('user_id', req.user.id)
        .select();

      if (error) return next(error);
      if (!data || data.length === 0) {
        return res.status(404).json({ success: false, error: 'Expense not found or unauthorized' });
      }
      
      res.json({ success: true, data: data[0] });
    } catch (err) {
      next(err);
    }
});

// Delete an expense
app.delete('/api/expenses/:id', auth, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select();

    if (error) return next(error);
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, error: 'Expense not found or unauthorized' });
    }
    
    res.json({ success: true, message: 'Expense removed securely' });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// AI PROXY ROUTES (Forward to Python Microservice)
// ==========================================

// Categorize transaction via Groq
app.post('/api/ai/categorize', auth, async (req, res, next) => {
  try {
    const { natural_language_input } = req.body;
    // Internal network call to the Python service running on port 8000
    const response = await fetch('http://localhost:8000/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ natural_language_input })
    });
    
    if (!response.ok) throw new Error('AI Service failed to categorize transaction');
    
    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// Parse Receipt via OpenAI Vision
app.post('/api/ai/parse-receipt', auth, async (req, res, next) => {
  try {
    const { storage_url } = req.body;
    const response = await fetch('http://localhost:8000/parse-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storage_url })
    });

    if (!response.ok) throw new Error('AI Service failed to parse receipt');
    
    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// FALLBACK AND GLOBAL ERROR HANDLERS
// ==========================================

// Fallback for 404 Not Found
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.statusCode = 404;
  next(error); 
});

// Global Error Handler (MUST BE LAST)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Secure Postgres/Supabase Server is running on port ${PORT}`);
});
