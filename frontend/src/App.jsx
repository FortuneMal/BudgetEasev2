import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';

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
    <div className={`flex flex-col items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-4`}>
      <div className="w-full max-w-sm relative">
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm cursor-pointer z-10"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>
        <LogoHeader />
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 mt-4">
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
const RegisterPage = ({ onAuthSuccess, onNavigate, theme, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error: sbError } = await supabase.auth.signUp({
      email,
      password,
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
    <div className={`flex flex-col items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} p-4`}>
      <div className="w-full max-w-sm relative">
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm cursor-pointer z-10"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>
        <LogoHeader />
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 mt-4">
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

// Dashboard Component
const DashboardPage = ({ onNavigate, selectedCurrency, setSelectedCurrency, theme, toggleTheme }) => {
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
  const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Other'];

  const token = localStorage.getItem('token');
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
      <div className="w-full max-w-5xl">
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
                className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CURRENCIES.map(code => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm cursor-pointer"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 shadow-sm cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This is where you'll manage your budget, track expenses, and view your financial insights.
          </p>

          {/* --- UPDATED FINANCIAL OVERVIEW --- */}
          <MetricCards
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            netSavings={netSavings}
            selectedCurrency={selectedCurrency}
          />

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
