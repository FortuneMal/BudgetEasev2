import React, { useState, useEffect } from 'react';

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
const LoginPage = ({ onAuthSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        onAuthSuccess();
      } else {
        setError(data.msg || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm">
        <LogoHeader />
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-900 dark:text-gray-100">
            Login to Your Account
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                type="submit"
              >
                Sign In
              </button>
              <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                Forgot Password?
              </a>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="font-bold text-blue-500 hover:text-blue-800 transition duration-300"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Registration Page Component
const RegisterPage = ({ onAuthSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        onAuthSuccess();
      } else {
        setError(data.msg || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-sm">
        <LogoHeader />
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-900 dark:text-gray-100">
            Create an Account
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                id="password"
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="font-bold text-blue-500 hover:text-blue-800 transition duration-300"
            >
              Log in
            </button>
          </p>
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
            <li key={expense._id} className={`py-4 flex items-center justify-between ${expense.isRecurring ? 'bg-indigo-50 dark:bg-indigo-900 rounded-lg p-2' : ''}`}>
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
                  onClick={() => onDelete(expense._id)}
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

// Dashboard Component
const DashboardPage = ({ onNavigate, selectedCurrency, setSelectedCurrency }) => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- NEW STATE for Financial Tracking ---
  const [income, setIncome] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState(JSON.parse(localStorage.getItem('categoryBudgets')) || {});
  const [goals, setGoals] = useState(JSON.parse(localStorage.getItem('goals')) || []);
  const [theme, setTheme] = useState('light'); // New state for theme
  const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Other'];

  const token = localStorage.getItem('token');
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filterCategory !== 'All') queryParams.append('category', filterCategory);
      if (sortBy) queryParams.append('sort', sortBy);
      if (searchQuery) queryParams.append('search', searchQuery);

      const response = await fetch(`${API_URL}/expenses?${queryParams.toString()}`, {
        headers: { 'x-auth-token': token },
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        onNavigate('login');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        throw new Error('Failed to fetch expenses');
      }
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
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(newExpense),
      });
      if (response.ok) {
        fetchExpenses();
      } else {
        throw new Error('Failed to add expense');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${updatedExpense._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(updatedExpense),
      });
      if (response.ok) {
        fetchExpenses();
      } else {
        throw new Error('Failed to update expense');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (response.ok) {
        fetchExpenses();
      } else {
        throw new Error('Failed to delete expense');
      }
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
    <div className={`flex flex-col items-center min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} p-4`}>
      <div className="w-full max-w-4xl">
        <LogoHeader />
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Welcome to your Dashboard
            </h2>
            <div className="flex items-center space-x-4">
              <label htmlFor="currency-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Currency:
              </label>
              <select
                id="currency-select"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
                {CURRENCIES.map(code => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This is where you'll manage your budget, track expenses, and view your financial insights.
          </p>
          
          {/* --- UPDATED FINANCIAL OVERVIEW --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">Total Income</h3>
              <p className="text-2xl font-extrabold text-green-900 dark:text-green-100">{formatCurrency(totalIncome, selectedCurrency)}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">Total Expenses</h3>
              <p className="text-2xl font-extrabold text-red-900 dark:text-red-100">{formatCurrency(totalExpenses, selectedCurrency)}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">Net Cash Flow</h3>
              <p className="text-2xl font-extrabold text-blue-900 dark:text-blue-100">{formatCurrency(netSavings, selectedCurrency)}</p>
            </div>
             <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200 mb-2">Remaining Budget</h3>
              <p className="text-2xl font-extrabold text-purple-900 dark:text-purple-100">N/A</p>
            </div>
          </div>

          {/* --- NEW SECTION: Category Budgets Progress --- */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Budget Progress by Category</h3>
            <div className="space-y-4">
              {categories.map(cat => {
                const totalSpent = expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0);
                const budgetAmount = categoryBudgets[cat] || 0;
                const progressPercentage = budgetAmount > 0 ? (totalSpent / budgetAmount) * 100 : 0;
                const progressColor = progressPercentage > 100 ? 'bg-red-500' : 'bg-blue-500';

                return (
                  <div key={cat}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{cat}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(totalSpent, selectedCurrency)} / {formatCurrency(budgetAmount, selectedCurrency)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                      <div
                        className={`${progressColor} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(100, progressPercentage)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <BudgetForm categories={categories} categoryBudgets={categoryBudgets} onSetBudget={handleSetBudget} selectedCurrency={selectedCurrency} />
          <IncomeForm onAddIncome={handleAddIncome} />
          <ExpenseForm 
            onAddExpense={handleAddExpense} 
            onUpdateExpense={handleUpdateExpense}
            editingExpense={editingExpense}
            onCancelEdit={handleCancelEdit}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <SpendingChart expenses={expenses} selectedCurrency={selectedCurrency} />
            <FinancialGoals goals={goals} onAddGoal={handleAddGoal} onRemoveGoal={handleRemoveGoal} totalSavings={netSavings} selectedCurrency={selectedCurrency} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-1/3 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full md:w-1/3 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="w-full md:w-1/3 flex justify-end gap-2">
                <button
                  onClick={() => setSortBy('amount_desc')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${sortBy === 'amount_desc' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                >
                  Sort by Amount
                </button>
                <button
                  onClick={() => setSortBy('date_desc')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${sortBy === 'date_desc' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                >
                  Sort by Date
                </button>
              </div>
            </div>
          </div>

          <ExpenseList 
            expenses={expenses} 
            onEdit={handleEditExpense} 
            onDelete={handleDeleteExpense} 
            selectedCurrency={selectedCurrency}
          />
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState(isAuthenticated ? 'dashboard' : 'login');
  const [selectedCurrency, setSelectedCurrency] = useState(getDefaultCurrency());

  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    navigateTo('dashboard');
  };

  const renderPage = () => {
    if (isAuthenticated) {
      return <DashboardPage onNavigate={navigateTo} selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />;
    }
    switch (currentPage) {
      case 'login':
        return <LoginPage onAuthSuccess={handleAuthSuccess} onNavigate={navigateTo} />;
      case 'register':
        return <RegisterPage onAuthSuccess={handleAuthSuccess} onNavigate={navigateTo} />;
      default:
        return <LoginPage onAuthSuccess={handleAuthSuccess} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900">
      {renderPage()}
    </div>
  );
};

export default App;
