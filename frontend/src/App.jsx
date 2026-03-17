import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';
import { 
  TrendingUp, TrendingDown, Wallet, Activity, LogOut, ShoppingCart, Zap, Film, Home, Coffee,
  User, CheckCircle, AlertCircle
} from 'lucide-react';
import budgetEaseLogo from './assets/budgetease logo.png';

// Function to get the default currency code.
const getDefaultCurrency = () => {
  return 'USD';
};

// Function to format a number into a currency string
const formatCurrency = (amount, currencyCode) => {
  const locale = navigator.language;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

const CURRENCIES = ['USD', 'EUR', 'GBP', 'ZAR', 'JPY', 'AUD', 'CAD'];
const API_URL = 'http://localhost:5000/api';

// LogoHeader Component
const LogoHeader = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 mb-8 rounded-lg flex items-center justify-center">
      <div className="flex items-center space-x-4">
        <img
          src="https://placehold.co/60x60/22c55e/ffffff?text=BE"
          alt="BudgetEase Logo"
          className="h-12 w-auto rounded-lg"
        />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          BudgetEase
        </h1>
      </div>
    </header>
  );
};

// Login Page Component
const LoginPage = ({ onAuthSuccess, onNavigate, theme, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error: sbError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (sbError) {
      setError(sbError.message);
    } else {
      localStorage.setItem('token', data.session.access_token);
      onAuthSuccess();
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans selection:bg-emerald-500/30 ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full max-w-md relative">
        
        {/* Theme Toggle placed outside the card for clean look */}
        <button
          onClick={toggleTheme}
          className={`absolute -top-16 right-0 p-2 rounded-full transition-colors shadow-sm cursor-pointer ${
            theme === 'dark' ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
          }`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>

        <div className="flex flex-col items-center mb-8">
            <img src={budgetEaseLogo} alt="BudgetEase" className="h-16 w-auto mb-4 drop-shadow-lg" />
            <p className={`mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Welcome back. Sign in to your account.</p>
        </div>

        <div className={`rounded-2xl p-8 border shadow-xl ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm p-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`} htmlFor="email">
                Email Address
              </label>
              <input
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  theme === 'dark' 
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500/50' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1.5 flex justify-between ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`} htmlFor="password">
                <span>Password</span>
                <a className="text-emerald-500 hover:text-emerald-400 font-medium text-xs transition-colors cursor-pointer">Forgot?</a>
              </label>
              <input
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  theme === 'dark' 
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500/50' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-lg shadow-emerald-500/20 flex justify-center items-center mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              type="submit"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="font-bold text-emerald-500 hover:text-emerald-400 transition duration-300 underline-offset-4 hover:underline"
              >
                Sign up instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Registration Page Component
const RegisterPage = ({ onAuthSuccess, onNavigate, theme, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error: sbError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    });

    if (sbError) {
      setError(sbError.message);
    } else if (data.session) {
      localStorage.setItem('token', data.session.access_token);
      onAuthSuccess();
    } else {
      setError('Registration successful! Please check your email to verify your account.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans selection:bg-emerald-500/30 ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full max-w-md relative">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`absolute -top-16 right-0 p-2 rounded-full transition-colors shadow-sm cursor-pointer ${
            theme === 'dark' ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
          }`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>

        <div className="flex flex-col items-center mb-8">
            <img src={budgetEaseLogo} alt="BudgetEase" className="h-16 w-auto mb-4 drop-shadow-lg" />
            <p className={`mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Start managing your finances today.</p>
        </div>

        <div className={`rounded-2xl p-8 border shadow-xl ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          {error && (
            <div className={`p-3 rounded-lg mb-6 text-center text-sm ${error.includes('successful') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border border-rose-500/20 text-rose-500'}`}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`} htmlFor="username">
                Username
              </label>
              <input
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  theme === 'dark' 
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500/50' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
                id="username"
                type="text"
                placeholder="e.g. FinanceWizard99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`} htmlFor="email">
                Email Address
              </label>
              <input
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  theme === 'dark' 
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500/50' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`} htmlFor="password">
                Password
              </label>
              <input
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  theme === 'dark' 
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600 focus:border-emerald-500/50' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
                id="password"
                type="password"
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-lg shadow-emerald-500/20 flex justify-center items-center mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              type="submit"
            >
              Create Account
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="font-bold text-emerald-500 hover:text-emerald-400 transition duration-300 underline-offset-4 hover:underline"
              >
                Log in instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// SpendingChart Component
const SpendingChart = ({ expenses, selectedCurrency }) => {
  const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Other'];
  const spendingByCategory = categories.map(category => {
    const total = expenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return { category, total };
  });

  const maxSpending = Math.max(...spendingByCategory.map(item => item.total), 1);
  const colors = {
    Groceries: 'bg-green-500 dark:bg-green-400',
    Utilities: 'bg-blue-500 dark:bg-blue-400',
    Entertainment: 'bg-purple-500 dark:bg-purple-400',
    Transportation: 'bg-yellow-500 dark:bg-yellow-400',
    Other: 'bg-red-500 dark:bg-red-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Spending by Category</h3>
      <div className="flex items-end justify-around h-48 md:h-64 border-b border-gray-300 dark:border-gray-600">
        {spendingByCategory.map(item => (
          <div key={item.category} className="flex flex-col items-center h-full w-1/5">
            <div
              className={`w-3/5 rounded-t-lg transition-all duration-500 ${colors[item.category]}`}
              style={{ height: `${(item.total / maxSpending) * 100}%` }}
              title={formatCurrency(item.total, selectedCurrency)}
            ></div>
            <span className="mt-2 text-xs font-semibold text-gray-600 dark:text-gray-400">{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ExpenseForm Component
const ExpenseForm = ({ onAddExpense, onUpdateExpense, editingExpense, onCancelEdit }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setName(editingExpense.name);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setIsRecurring(editingExpense.isRecurring);
    }
  }, [editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) {
      console.log('Please fill out all fields.');
      return;
    }

    if (editingExpense) {
      const updatedExpense = {
        ...editingExpense,
        name,
        amount: parseFloat(amount),
        category,
      };
      onUpdateExpense(updatedExpense);
      onCancelEdit();
    } else {
      const newExpense = {
        name,
        amount: parseFloat(amount),
        category,
        isRecurring,
      };
      onAddExpense(newExpense);
    }

    setName('');
    setAmount('');
    setIsRecurring(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        {editingExpense ? 'Edit Expense' : 'Add a New Expense'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="expenseName">
            Expense Name
          </label>
          <input
            type="text"
            id="expenseName"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="amount">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Groceries</option>
            <option>Utilities</option>
            <option>Entertainment</option>
            <option>Transportation</option>
            <option>Other</option>
          </select>
        </div>
        <div className="flex items-center gap-2 lg:col-span-1">
          <input
            type="checkbox"
            id="isRecurring"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recurring Expense
          </label>
        </div>
        <div className="flex items-center gap-2 md:col-span-2 lg:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingExpense ? 'Save Changes' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// ExpenseList Component
const ExpenseList = ({ expenses, onEdit, onDelete, selectedCurrency }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Expenses</h3>
      {expenses.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">No expenses added yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {expenses.map((expense) => (
            <li key={expense.id || expense._id} className={`py-4 flex items-center justify-between ${expense.isRecurring ? 'bg-indigo-50 dark:bg-indigo-900 rounded-lg p-2' : ''}`}>
              <div className="flex flex-col">
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {expense.name} {expense.isRecurring && <span className="text-xs text-indigo-500 dark:text-indigo-300">(Recurring)</span>}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{expense.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-600 dark:text-red-400 font-semibold">{formatCurrency(expense.amount, selectedCurrency)}</span>
                <button
                  onClick={() => onEdit(expense)}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 text-xs py-1 px-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(expense.id || expense._id)}
                  className="bg-red-200 hover:bg-red-300 dark:bg-red-600 dark:hover:bg-red-500 text-red-800 dark:text-red-200 text-xs py-1 px-2 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- NEW COMPONENT: BudgetForm ---
const BudgetForm = ({ categories, categoryBudgets, onSetBudget, selectedCurrency }) => {
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount) {
      onSetBudget(category, parseFloat(amount));
      setAmount('');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Set Monthly Budgets</h3>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="budgetCategory">
            Category
          </label>
          <select
            id="budgetCategory"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="budgetAmount">
            Amount
          </label>
          <input
            type="number"
            id="budgetAmount"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Set Budget
        </button>
      </form>
    </div>
  );
};

// --- NEW COMPONENT: IncomeForm ---
const IncomeForm = ({ onAddIncome }) => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (source && amount) {
      onAddIncome({ source, amount: parseFloat(amount), date: new Date().toISOString() });
      setSource('');
      setAmount('');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Add Income</h3>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="incomeSource">
            Source
          </label>
          <input
            type="text"
            id="incomeSource"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="incomeAmount">
            Amount
          </label>
          <input
            type="number"
            id="incomeAmount"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full md:w-auto bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Add Income
        </button>
      </form>
    </div>
  );
};

// --- NEW COMPONENT: FinancialGoals ---
const FinancialGoals = ({ goals, onAddGoal, onRemoveGoal, totalSavings, selectedCurrency }) => {
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goalName && goalAmount) {
      const newGoal = {
        id: Date.now(),
        name: goalName,
        target: parseFloat(goalAmount),
        progress: 0,
      };
      onAddGoal(newGoal);
      setGoalName('');
      setGoalAmount('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Financial Goals</h3>

      {/* Goal Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="goalName">Goal Name</label>
          <input
            type="text"
            id="goalName"
            className="w-full px-3 py-2 border rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            required
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="goalAmount">Target Amount</label>
          <input
            type="number"
            id="goalAmount"
            className="w-full px-3 py-2 border rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          Add Goal
        </button>
      </form>

      {/* Goal List */}
      <ul className="space-y-4">
        {goals.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">No goals set yet.</p>
        ) : (
          goals.map(goal => {
            const progress = Math.min(totalSavings, goal.target);
            const progressPercentage = (progress / goal.target) * 100;
            return (
              <li key={goal.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{goal.name}</h4>
                  <button onClick={() => onRemoveGoal(goal.id)} className="text-red-500 hover:text-red-700">
                    &times;
                  </button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {formatCurrency(progress, selectedCurrency)} of {formatCurrency(goal.target, selectedCurrency)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                  <div
                    className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs mt-1 text-gray-600 dark:text-gray-400">
                  {progressPercentage.toFixed(0)}%
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};
const MetricCards = ({ totalIncome, totalExpenses, netSavings, selectedCurrency, theme }) => {
  return (
    // The main grid container: 1 column on mobile, 4 columns on medium+ screens
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 w-full max-w-6xl mx-auto">
      
      {/* 1. Total Income Card */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-shadow duration-300`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium tracking-wide uppercase`}>Total Income</h3>
          {/* Subtle Icon Container */}
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <svg className="w-5 h-5 text-emerald-500 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(totalIncome, selectedCurrency)}</p>
      </div>

      {/* 2. Total Expenses Card */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-shadow duration-300`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium tracking-wide uppercase`}>Total Expenses</h3>
          <div className="p-2 bg-rose-500/10 rounded-lg">
            <svg className="w-5 h-5 text-rose-500 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
        <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(totalExpenses, selectedCurrency)}</p>
      </div>

      {/* 3. Net Cash Flow Card */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-shadow duration-300`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium tracking-wide uppercase`}>Net Cash Flow</h3>
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <svg className="w-5 h-5 text-blue-500 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(netSavings, selectedCurrency)}</p>
      </div>

      {/* 4. Remaining Budget Card */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-shadow duration-300`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm font-medium tracking-wide uppercase`}>Remaining Budget</h3>
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <svg className="w-5 h-5 text-purple-500 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
        <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>N/A</p>
      </div>

    </div>
  );
};

const SavingTipsAI = ({ totalIncome, totalExpenses, goals, categoryBudgets }) => {
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTips = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('Groq API Key is not configured. Please add VITE_GROQ_API_KEY to your .env file inside frontend directory, then restart your dev server.');
      }

      const prompt = `You are a strict, concise, and helpful financial advisor. Here is my current financial profile:
- Total Income: ${totalIncome}
- Total Expenses: ${totalExpenses}
- Net Cash Flow: ${totalIncome - totalExpenses}
- Active Goals: ${goals.length > 0 ? goals.map(g => g.name).join(', ') : 'None'}
- Category Budgets Setup: ${Object.keys(categoryBudgets).length > 0 ? Object.keys(categoryBudgets).join(', ') : 'None'}

Please give me 3 specific, actionable saving tips tailored exactly to this profile. Limit your response to 3 short bullet points. Do not include introductory text, just the bullet points.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      setTips(data.choices[0].message.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        Personal AI Saving Tips
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
        Get personalized recommendations on how to allocate your budget and boost your savings, powered instantly by Groq.
      </p>
      
      {!tips && !loading && !error && (
        <button
          onClick={fetchTips}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 shadow-md"
        >
          Generate My Personalized Tips
        </button>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-indigo-500 font-medium tracking-wide">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Analyzing profile...
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-4 rounded-lg font-medium border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {tips && (
        <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-100 dark:border-gray-600 leading-relaxed">
          {tips}
          <div className="mt-6 flex justify-end">
            <button onClick={fetchTips} className="text-sm text-indigo-500 hover:text-indigo-400 font-semibold uppercase tracking-wide">
              Refresh Tips
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ProfileSettings Component
const ProfileSettings = ({ theme }) => {
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.username || '';
        setCurrentUsername(name);
        setNewUsername(name);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const { error } = await supabase.auth.updateUser({
      data: { username: newUsername }
    });

    if (error) {
      setStatus({ type: 'error', message: error.message });
    } else {
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
      setCurrentUsername(newUsername);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center">
      <div className={`rounded-2xl p-6 sm:p-8 border shadow-lg max-w-md w-full ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <User size={24} />
          </div>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Profile Settings</h2>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div>
            <label htmlFor="profile-username" className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Display Name
            </label>
            <input
              id="profile-username"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              disabled={loading}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:opacity-50 ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              placeholder="Enter a new username"
              required
            />
          </div>

          {status.message && (
            <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
              status.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-rose-500/10 text-rose-500'
            }`}>
              {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || newUsername === currentUsername || !newUsername.trim()}
            className="w-full bg-emerald-500 text-white rounded-xl px-4 py-3 font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-lg shadow-emerald-500/20"
          >
            {loading ? (
              <span className="animate-pulse">Updating...</span>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Dashboard Component
const DashboardPage = ({ onNavigate, onLogout, selectedCurrency, setSelectedCurrency, theme, toggleTheme }) => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // New Tab State
  const [currentUser, setCurrentUser] = useState(null);

  // --- NEW STATE for Financial Tracking ---
  const [income, setIncome] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState(JSON.parse(localStorage.getItem('categoryBudgets')) || {});
  const [goals, setGoals] = useState(JSON.parse(localStorage.getItem('goals')) || []);
  const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Other'];

  const token = localStorage.getItem('token');

  // Fetch current user for personalized greeting
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
    };
    getUser();
  }, []);
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('expenses').select('*');

      if (filterCategory !== 'All') {
        query = query.eq('category', filterCategory);
      }

      let orderColumn = 'created_at';
      let ascending = false;
      if (sortBy === 'amount_desc') {
        orderColumn = 'amount';
      } else if (sortBy === 'date_desc') {
        orderColumn = 'created_at';
      }

      const { data, error: sbError } = await query.order(orderColumn, { ascending });

      if (sbError) {
        throw new Error(sbError.message);
      }

      let filteredData = data;
      if (searchQuery) {
        filteredData = data.filter(e =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setExpenses(filteredData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token, filterCategory, sortBy, searchQuery]);

  const handleAddExpense = async (newExpense) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error('Not logged in');

      const { error: sbError } = await supabase.from('expenses')
        .insert([{
          name: newExpense.name,
          amount: newExpense.amount,
          category: newExpense.category,
          isRecurring: newExpense.isRecurring || false,
          user_id: userData.user.id
        }]);

      if (sbError) {
        throw new Error(sbError.message);
      }
      fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      const { error: sbError } = await supabase.from('expenses')
        .update({
          name: updatedExpense.name,
          amount: updatedExpense.amount,
          category: updatedExpense.category,
          isRecurring: updatedExpense.isRecurring || false
        })
        .eq('id', updatedExpense.id || updatedExpense._id);

      if (sbError) {
        throw new Error(sbError.message);
      }
      fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const { error: sbError } = await supabase.from('expenses')
        .delete()
        .eq('id', id);

      if (sbError) {
        throw new Error(sbError.message);
      }
      fetchExpenses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    onNavigate('login');
  };

  // --- NEW FUNCTIONS for Financial Tracking ---
  const handleSetBudget = (category, amount) => {
    const newBudgets = { ...categoryBudgets, [category]: amount };
    setCategoryBudgets(newBudgets);
    localStorage.setItem('categoryBudgets', JSON.stringify(newBudgets));
  };

  const handleAddIncome = (newIncome) => {
    const newIncomeList = [...income, newIncome];
    setIncome(newIncomeList);
    // For simplicity, we won't persist income yet, but a future backend would.
  };

  const handleAddGoal = (newGoal) => {
    const newGoals = [...goals, newGoal];
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
  };

  const handleRemoveGoal = (goalId) => {
    const newGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  const netSavings = totalIncome - totalExpenses;

  if (loading) return <div className="text-center text-lg mt-8">Loading...</div>;
  if (error) return <div className="text-center text-lg text-red-500 mt-8">Error: {error}</div>;

  return (
    <div className={`min-h-screen font-sans selection:bg-emerald-500/30 ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* TOP NAVIGATION */}
      <nav className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} border-b sticky top-0 z-10 shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={budgetEaseLogo} alt="BudgetEase Logo" className="h-8 w-auto" />
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors shadow-sm cursor-pointer ${
                theme === 'dark' ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>

            <div className={`flex items-center gap-2 rounded-lg p-1 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
              <span className={`text-xs pl-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Currency:</span>
              <select 
                value={selectedCurrency} 
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className={`bg-transparent text-sm font-medium focus:outline-none pr-2 pb-0.5 cursor-pointer appearance-none ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                {CURRENCIES.map(code => (
                  <option key={code} value={code} className="text-gray-900">{code}</option>
                ))}
              </select>
            </div>
            
            <button
               onClick={handleLogout}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-transparent ${
                 theme === 'dark'
                 ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20'
                 : 'text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200'
               }`}
             >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HEADER SECTION */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, <span className="text-emerald-400">{currentUser?.user_metadata?.username || 'there'}</span>
            </h1>
            <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Here is what's happening with your money today.</p>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          
          <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-emerald-500">
              <TrendingUp size={80} />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} text-sm font-medium uppercase tracking-wider`}>Total Income</h3>
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className={`text-3xl font-bold relative z-10 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(totalIncome, selectedCurrency)}</p>
          </div>

          <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-rose-500">
              <TrendingDown size={80} />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} text-sm font-medium uppercase tracking-wider`}>Total Expenses</h3>
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                <TrendingDown size={20} />
              </div>
            </div>
            <p className={`text-3xl font-bold relative z-10 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(totalExpenses, selectedCurrency)}</p>
          </div>

          <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-blue-500">
              <Activity size={80} />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} text-sm font-medium uppercase tracking-wider`}>Net Cash Flow</h3>
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Activity size={20} />
              </div>
            </div>
            <p className={`text-3xl font-bold relative z-10 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(netSavings, selectedCurrency)}</p>
          </div>

          <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-purple-500">
              <Wallet size={80} />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <h3 className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} text-sm font-medium uppercase tracking-wider`}>Remaining Budget</h3>
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <Wallet size={20} />
              </div>
            </div>
            <p className={`text-3xl font-bold relative z-10 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(netSavings, selectedCurrency)}</p>
          </div>

        </div>

        {/* --- TABS NAVIGATION --- */}
        <div className={`flex space-x-2 md:space-x-8 border-b-2 mb-8 overflow-x-auto ${theme === 'dark' ? 'border-slate-800' : 'border-gray-200'}`}>
          {['dashboard', 'expenses', 'income', 'goals', 'tips', 'profile'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 text-sm md:text-base font-semibold uppercase tracking-wider transition-colors whitespace-nowrap
                ${activeTab === tab 
                  ? 'border-b-4 border-emerald-500 text-emerald-500' 
                  : `border-transparent ${theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-700'}`}`}
            >
              {tab === 'tips' ? 'Saving Tips ✨' : tab === 'dashboard' ? 'Overview' : tab === 'profile' ? '👤 Profile' : tab}
            </button>
          ))}
        </div>

        {/* --- TAB VIEWS --- */}

        {/* DASHBOARD OVERVIEW TAB (THE NEW UI) */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 animate-fadeIn">
            
            {/* BUDGET PROGRESS */}
            <div className={`lg:col-span-2 rounded-2xl p-6 sm:p-8 border shadow-lg ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
               <div className="flex justify-between items-center mb-6">
                <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Budget Progress</h2>
                <button onClick={() => setActiveTab('expenses')} className="text-sm font-medium text-emerald-500 hover:text-emerald-400">Manage Budgets &rarr;</button>
              </div>
              
              <div className="space-y-6">
                {categories.map((catString) => {
                  const totalSpent = expenses.filter(exp => exp.category === catString).reduce((sum, exp) => sum + exp.amount, 0);
                  const limit = categoryBudgets[catString] || 0;
                  
                  // fallback to not showing unbudgeted empty categories
                  if (limit === 0 && totalSpent === 0) return null;

                  const percentage = limit > 0 ? Math.min((totalSpent / limit) * 100, 100) : (totalSpent > 0 ? 100 : 0);
                  const isOverBudget = limit > 0 && totalSpent > limit;
                  
                  let Icon = Activity;
                  let colorClass = 'bg-slate-500';
                  if (catString === 'Home' || catString === 'Housing & Rent') { Icon = Home; colorClass = 'bg-indigo-500'; }
                  else if (catString === 'Groceries') { Icon = ShoppingCart; colorClass = 'bg-emerald-500'; }
                  else if (catString === 'Utilities') { Icon = Zap; colorClass = 'bg-amber-500'; }
                  else if (catString === 'Entertainment') { Icon = Film; colorClass = 'bg-rose-500'; }
                  else if (catString === 'Transportation') { Icon = Coffee; colorClass = 'bg-blue-500'; }

                  return (
                    <div key={catString} className="w-full group">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                            <Icon size={16} />
                          </div>
                          <span className={`font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-gray-800'}`}>{catString}</span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <div className="flex items-baseline gap-1">
                            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(totalSpent, selectedCurrency)}</span>
                            {limit > 0 && <span className={`text-sm hidden sm:inline ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>/ {formatCurrency(limit, selectedCurrency)}</span>}
                          </div>
                          {isOverBudget && (
                            <span className="text-xs text-rose-500 font-medium mt-0.5">
                              Over budget by {formatCurrency(totalSpent - limit, selectedCurrency)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className={`w-full rounded-full h-2.5 overflow-hidden border ${theme === 'dark' ? 'bg-slate-800 border-slate-700/50' : 'bg-gray-200 border-gray-300'}`}>
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden ${isOverBudget ? 'bg-rose-500' : colorClass}`}
                          style={{ width: `${limit > 0 ? percentage : (totalSpent > 0 ? 100 : 0)}%` }}
                        >
                          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RECENT TRANSACTIONS */}
            <div className={`rounded-2xl p-6 sm:p-8 border shadow-lg flex flex-col ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
              </div>
              
              <div className="space-y-4 flex-1">
                {expenses.slice(0, 5).map((exp) => {
                  let Icon = Activity;
                  let colorClass = 'text-slate-500';
                  let bgClass = 'bg-slate-500/10';
                  
                  if (exp.category === 'Home' || exp.category === 'Housing & Rent') { Icon = Home; colorClass = 'text-indigo-500'; bgClass = 'bg-indigo-500/10'; }
                  else if (exp.category === 'Groceries') { Icon = ShoppingCart; colorClass = 'text-emerald-500'; bgClass = 'bg-emerald-500/10'; }
                  else if (exp.category === 'Utilities') { Icon = Zap; colorClass = 'text-amber-500'; bgClass = 'bg-amber-500/10'; }
                  else if (exp.category === 'Entertainment') { Icon = Film; colorClass = 'text-rose-500'; bgClass = 'bg-rose-500/10'; }
                  else if (exp.category === 'Transportation') { Icon = Coffee; colorClass = 'text-blue-500'; bgClass = 'bg-blue-500/10'; }

                  return (
                    <div key={exp.id || exp._id} className={`flex items-center justify-between p-3 rounded-xl transition-colors -mx-3 border border-transparent cursor-pointer ${theme === 'dark' ? 'hover:bg-slate-800/50 hover:border-slate-800' : 'hover:bg-gray-50 hover:border-gray-100'}`}>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`p-2.5 rounded-xl ${bgClass} ${colorClass}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className={`font-medium text-sm sm:text-base ${theme === 'dark' ? 'text-slate-200' : 'text-gray-900'}`}>{exp.name}</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                            {exp.category} • {new Date(exp.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        -{formatCurrency(exp.amount, selectedCurrency)}
                      </span>
                    </div>
                  )
                })}
                {expenses.length === 0 && (
                  <p className={`text-sm text-center italic mt-auto mb-auto ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>No recent expenses.</p>
                )}
              </div>
              
              <button 
                onClick={() => setActiveTab('expenses')}
                className={`w-full mt-6 py-2.5 rounded-xl border font-medium text-sm transition-colors ${
                  theme === 'dark' 
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                View All Transactions
              </button>
            </div>
          </div>
        )}

        {/* EXPENSES TAB */}
        {activeTab === 'expenses' && (
          <div className="animate-fadeIn space-y-6 max-w-4xl mx-auto">
            <BudgetForm categories={categories} categoryBudgets={categoryBudgets} onSetBudget={handleSetBudget} selectedCurrency={selectedCurrency} />
            <ExpenseForm onAddExpense={handleAddExpense} onUpdateExpense={handleUpdateExpense} editingExpense={editingExpense} onCancelEdit={handleCancelEdit} />
            <div className={`p-6 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                <SpendingChart expenses={expenses} selectedCurrency={selectedCurrency} />
            </div>
            <div className={`p-6 rounded-2xl shadow-lg border mb-6 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                 <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className={`md:w-48 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  >
                    <option value="All">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
              </div>
              <ExpenseList expenses={expenses} onEdit={handleEditExpense} onDelete={handleDeleteExpense} selectedCurrency={selectedCurrency} />
            </div>
          </div>
        )}

        {/* INCOME TAB */}
        {activeTab === 'income' && (
          <div className="animate-fadeIn max-w-2xl mx-auto">
            <IncomeForm onAddIncome={handleAddIncome} />
            {income.length > 0 && (
              <div className={`mt-6 p-6 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Income Sources</h3>
                <div className="space-y-3">
                  {income.map((inc, i) => (
                    <div key={i} className={`flex justify-between items-center p-3 rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                      <div>
                         <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{inc.source}</p>
                         <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{new Date(inc.date).toLocaleDateString()}</p>
                      </div>
                      <span className="font-bold text-emerald-500">+{formatCurrency(inc.amount, selectedCurrency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* GOALS TAB */}
        {activeTab === 'goals' && (
          <div className="animate-fadeIn max-w-3xl mx-auto">
             <FinancialGoals goals={goals} onAddGoal={handleAddGoal} onRemoveGoal={handleRemoveGoal} totalSavings={netSavings} selectedCurrency={selectedCurrency} />
          </div>
        )}

        {/* TIPS TAB */}
        {activeTab === 'tips' && (
          <div className="animate-fadeIn max-w-3xl mx-auto">
            <SavingTipsAI totalIncome={totalIncome} totalExpenses={totalExpenses} goals={goals} categoryBudgets={categoryBudgets} />
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="animate-fadeIn max-w-lg mx-auto">
            <ProfileSettings theme={theme} />
          </div>
        )}

      </main>
    </div>
  );
};

// Main App Component
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState(isAuthenticated ? 'dashboard' : 'login');
  const [selectedCurrency, setSelectedCurrency] = useState(getDefaultCurrency());
  
  // Lift Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // Apply Tailwind dark mode class to HTML element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    navigateTo('dashboard');
  };

  const renderPage = () => {
    if (isAuthenticated) {
      return (
        <DashboardPage 
          onNavigate={navigateTo} 
          onLogout={() => setIsAuthenticated(false)}
          selectedCurrency={selectedCurrency} 
          setSelectedCurrency={setSelectedCurrency} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
      );
    }
    switch (currentPage) {
      case 'login':
        return <LoginPage onAuthSuccess={handleAuthSuccess} onNavigate={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
      case 'register':
        return <RegisterPage onAuthSuccess={handleAuthSuccess} onNavigate={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <LoginPage onAuthSuccess={handleAuthSuccess} onNavigate={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
    }
  };

  return (
    <div className={`font-sans antialiased min-h-screen transition-colors duration-300 ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100'}`}>
      {renderPage()}
    </div>
  );
};

export default App;
