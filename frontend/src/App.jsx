// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from './redux/slices/authSlice.jsx';

import LoginPage from './components/LoginPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import ExpensesPage from './components/Expenses/ExpensesPage.jsx';
import BudgetsPage from './components/Budgets/BudgetsPage.jsx';
import SavingsGoalsPage from './components/Goals/SavingsGoalsPage.jsx';

// --- Navbar Component (Updated for Minimalist Look) ---
const Navbar = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <nav className="bg-white p-4 shadow-sm border-b border-gray-200"> {/* White background, subtle shadow, light border */}
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-primary-dark text-2xl font-bold"> {/* Custom primary-dark color */}
                    BudgetEase
                </Link>
                <div className="flex items-center space-x-6">
                    <Link to="/dashboard" className="text-gray-800 hover:text-primary transition duration-200"> {/* Darker text, subtle hover */}
                        Dashboard
                    </Link>
                    <Link to="/expenses" className="text-gray-800 hover:text-primary transition duration-200">
                        Expenses
                    </Link>
                    <Link to="/budgets" className="text-gray-800 hover:text-primary transition duration-200">
                        Budgets
                    </Link>
                    <Link to="/goals" className="text-gray-800 hover:text-primary transition duration-200">
                        Goals
                    </Link>
                    {user && (
                        <span className="text-gray-600 text-lg"> {/* Muted text for welcome message */}
                            Welcome, {user.name}!
                        </span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow-sm transition duration-300 ease-in-out" // Subtle rounded corners, shadow
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

// --- Main App Component ---
const App = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    return (
        <Router>
            {isAuthenticated && <Navbar />}
            <Routes>
                <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/expenses" element={isAuthenticated ? <ExpensesPage /> : <Navigate to="/login" />} />
                <Route path="/budgets" element={isAuthenticated ? <BudgetsPage /> : <Navigate to="/login" />} />
                <Route path="/goals" element={isAuthenticated ? <SavingsGoalsPage /> : <Navigate to="/login" />} />

                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default App;

