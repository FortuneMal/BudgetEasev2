// frontend/src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from './redux/slices/authSlice'; // Import logout action

import LoginPage from './components/LoginPage.jsx';
import Dashboard from './components/Dashboard.jsx'; // Added the missing quote
import ExpensesPage from './components/Expenses/ExpensesPage.jsx'; // Import the new ExpensesPage
// Import other pages as you create them (BudgetsPage, SavingsGoalsPage)

// --- Navbar Component ---
const Navbar = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <nav className="bg-budget-blue-dark p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-white text-2xl font-bold">
                    BudgetEase
                </Link>
                <div className="flex items-center space-x-6">
                    <Link to="/dashboard" className="text-white hover:text-budget-blue-light transition duration-200">
                        Dashboard
                    </Link>
                    <Link to="/expenses" className="text-white hover:text-budget-blue-light transition duration-200">
                        Expenses
                    </Link>
                    {/* Add links for Budgets and Goals once you create their pages */}
                    {/* <Link to="/budgets" className="text-white hover:text-budget-blue-light transition duration-200">
                        Budgets
                    </Link>
                    <Link to="/goals" className="text-white hover:text-budget-blue-light transition duration-200">
                        Goals
                    </Link> */}
                    {user && (
                        <span className="text-budget-white text-lg">Welcome, {user.name}!</span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
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
    // Redux handles auth state, so we just select it
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    return (
        <Router>
            {/* Tailwind CSS CDN and Inter font are already in public/index.html */}
            {isAuthenticated && <Navbar />} {/* Show Navbar only when logged in */}
            <Routes>
                <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/expenses" element={isAuthenticated ? <ExpensesPage /> : <Navigate to="/login" />} />
                {/* Add routes for Budgets and Goals here */}
                {/* <Route path="/budgets" element={isAuthenticated ? <BudgetsPage /> : <Navigate to="/login" />} /> */}
                {/* <Route path="/goals" element={isAuthenticated ? <SavingsGoalsPage /> : <Navigate to="/login" />} /> */}

                {/* Default route: redirect based on authentication status */}
                <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                {/* Catch-all for unknown routes */}
                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
};

export default App;

