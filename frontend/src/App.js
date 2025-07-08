import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard'; // Your main dashboard component
import ExpensesPage from './components/Expenses/ExpensesPage'; // A page for expenses
import BudgetsPage from './components/Budgets/BudgetsPage';   // A page for budgets
import SavingsGoalsPage from './components/SavingsGoals/SavingsGoalsPage'; // A page for goals
import Navbar from './components/Navbar'; // Your navigation bar

// Assume AuthContext is defined elsewhere, e.g., in contexts/AuthContext.js
const AuthContext = createContext(null);
// ... (AuthContext implementation from demo)

const App = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (user) => {
        setCurrentUser(user);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    };

    const logout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            <Router>
                {currentUser && <Navbar />} {/* Show Navbar only when logged in */}
                <Routes>
                    <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage />} />
                    <Route path="/dashboard" element={currentUser ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/expenses" element={currentUser ? <ExpensesPage /> : <Navigate to="/login" />} />
                    <Route path="/budgets" element={currentUser ? <BudgetsPage /> : <Navigate to="/login" />} />
                    <Route path="/goals" element={currentUser ? <SavingsGoalsPage /> : <Navigate to="/login" />} />
                    <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
                    {/* Add a catch-all for 404 or redirect */}
                    <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
