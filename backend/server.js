const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const mongoURI = 'mongodb://localhost:27017/';
const jwtSecret = 'YOUR_SUPER_SECRET_JWT_KEY';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Expense Schema
const expenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  isRecurring: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Expense = mongoose.model('Expense', expenseSchema);

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Routes
// Register a new user
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(payload, jwtSecret, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(payload, jwtSecret, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// GET all expenses with filtering, sorting, and searching
app.get('/api/expenses', auth, async (req, res) => {
  try {
    const { category, sort, search } = req.query;
    const filter = { user: req.user.id };
    const sortOptions = {};

    // Filter by category
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Search by name
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Sorting
    if (sort) {
      switch (sort) {
        case 'amount_asc':
          sortOptions.amount = 1;
          break;
        case 'amount_desc':
          sortOptions.amount = -1;
          break;
        case 'date_asc':
          sortOptions.date = 1;
          break;
        case 'date_desc':
          sortOptions.date = -1;
          break;
      }
    }

    const expenses = await Expense.find(filter).sort(sortOptions);
    res.json(expenses);
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// POST a new expense
app.post('/api/expenses', auth, async (req, res) => {
  const { name, amount, category, isRecurring } = req.body;
  try {
    const newExpense = new Expense({ name, amount, category, isRecurring, user: req.user.id });
    const expense = await newExpense.save();
    res.json(expense);
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// PUT (update) an expense
app.put('/api/expenses/:id', auth, async (req, res) => {
  const { name, amount, category } = req.body;
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    expense.name = name;
    expense.amount = amount;
    expense.category = category;
    await expense.save();
    res.json(expense);
  } catch (e) {
    res.status(500).send('Server error');
  }
});

// DELETE an expense
app.delete('/api/expenses/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Expense.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Expense removed' });
  } catch (e) {
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
