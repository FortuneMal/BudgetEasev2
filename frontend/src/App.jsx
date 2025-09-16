import React, { useState, useEffect } from 'react';
import budgetEaseLogo from './assets/budgetease logo.png';

const API_URL = 'http://localhost:5000/api';

// LogoHeader Component
const LogoHeader = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 mb-8 rounded-lg flex items-center justify-center">
      <div className="flex items-center space-x-4">
        <img
          src={budgetEaseLogo}
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
const SpendingChart = ({ expenses }) => {
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
              title={`$${item.total.toFixed(2)}`}
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

  useEffect(() => {
    if (editingExpense) {
      setName(editingExpense.name);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
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
      };
      onAddExpense(newExpense);
    }

    setName('');
    setAmount('');
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
            Amount ($)
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
        <div className="flex items-center gap-2 md:col-span-2 lg:col-span-3">
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
const ExpenseList = ({ expenses, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Expenses</h3>
      {expenses.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">No expenses added yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {expenses.map((expense) => (
            <li key={expense._id} className="py-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-gray-900 dark:text-gray-100 font-medium">{expense.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{expense.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-600 dark:text-red-400 font-semibold">${expense.amount.toFixed(2)}</span>
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

// Dashboard Component
const DashboardPage = ({ onNavigate }) => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        headers: { 'x-auth-token': token },
      });
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
  }, [token]);

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

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBudget = 5000 - totalExpenses;

  if (loading) return <div className="text-center text-lg mt-8">Loading...</div>;
  if (error) return <div className="text-center text-lg text-red-500 mt-8">Error: {error}</div>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl">
        <LogoHeader />
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Welcome to your Dashboard
            </h2>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This is where you'll manage your budget, track expenses, and view your financial insights.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">Total Budget</h3>
              <p className="text-2xl font-extrabold text-blue-900 dark:text-blue-100">$5,000</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">Expenses</h3>
              <p className="text-2xl font-extrabold text-green-900 dark:text-green-100">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">Remaining</h3>
              <p className="text-2xl font-extrabold text-yellow-900 dark:text-yellow-100">${remainingBudget.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-8">
            <SpendingChart expenses={expenses} />
            <ExpenseForm 
              onAddExpense={handleAddExpense} 
              onUpdateExpense={handleUpdateExpense}
              editingExpense={editingExpense}
              onCancelEdit={handleCancelEdit}
            />
            <ExpenseList 
              expenses={expenses} 
              onEdit={handleEditExpense} 
              onDelete={handleDeleteExpense} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState(isAuthenticated ? 'dashboard' : 'login');

  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    navigateTo('dashboard');
  };

  const renderPage = () => {
    if (isAuthenticated) {
      return <DashboardPage onNavigate={navigateTo} />;
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
