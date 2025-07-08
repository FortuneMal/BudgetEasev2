import React, { useState, createContext, useContext, useEffect } from 'react';

// --- Context for User Authentication ---
const AuthContext = createContext(null);

// --- Login Page Component ---
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);

    // Handles the login form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            // Simulate API call to backend
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user); // Update context with logged-in user
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Network error or server is not running.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border-b-4 border-blue-500">
                <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-8">
                    BudgetEase
                </h2>
                <h3 className="text-2xl font-semibold text-center text-blue-700 mb-6">
                    Login to Your Account
                </h3>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-lg font-medium text-gray-700 mb-2">
                            Username / Email
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                            placeholder="Enter your username or email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-red-600 text-center text-md font-medium">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-xl"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-8 text-center text-gray-600 text-sm">
                    Demo Accounts:
                    <br />
                    <span className="font-semibold">Hannah</span> (password: password123)
                    <br />
                    <span className="font-semibold">David</span> (password: password123)
                </p>
            </div>
        </div>
    );
};

// --- User Page Component ---
const UserPage = () => {
    const { currentUser, logout } = useContext(AuthContext);

    if (!currentUser) {
        // Should not happen if routing is correct, but good for safety
        return <p>Loading user data...</p>;
    }

    return (
        <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center">
            {/* Header */}
            <header className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-lg flex justify-between items-center mb-8 border-b-4 border-blue-500">
                <h1 className="text-4xl font-extrabold text-blue-900">
                    BudgetEase
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-xl font-semibold text-blue-700">
                        Welcome, {currentUser.name}!
                    </span>
                    <button
                        onClick={logout}
                        className="py-2 px-5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Expense Categorization Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-400">
                    <h2 className="text-2xl font-bold text-blue-800 mb-4">Expense Categorization</h2>
                    <p className="text-gray-700 mb-4">
                        Track where your money goes by categorizing your expenses.
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Groceries: $300</li>
                        <li>Utilities: $150</li>
                        <li>Transport: $80</li>
                        <li>Entertainment: $120</li>
                    </ul>
                    <button className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                        View Details
                    </button>
                </div>

                {/* Budget Tracking Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-400">
                    <h2 className="text-2xl font-bold text-blue-800 mb-4">Budget Tracking</h2>
                    <p className="text-gray-700 mb-4">
                        Monitor your spending against your set budgets.
                    </p>
                    <div className="mb-2">
                        <span className="font-semibold text-gray-800">Monthly Income:</span> $3,500
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold text-gray-800">Budgeted:</span> $2,800
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold text-gray-800">Remaining:</span> $700
                    </div>
                    <button className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                        Manage Budgets
                    </button>
                </div>

                {/* Savings Goals Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-400">
                    <h2 className="text-2xl font-bold text-blue-800 mb-4">Savings Goals</h2>
                    <p className="text-gray-700 mb-4">
                        Set and track your progress towards financial goals.
                    </p>
                    <div className="mb-2">
                        <span className="font-semibold text-gray-800">Vacation Fund:</span> $800 / $2,000 (40%)
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold text-gray-800">Emergency Fund:</span> $1,500 / $5,000 (30%)
                    </div>
                    <button className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                        Add New Goal
                    </button>
                </div>

                {/* Personalized Recommendations Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-400">
                    <h2 className="text-2xl font-bold text-blue-800 mb-4">Personalized Recommendations</h2>
                    <p className="text-gray-700 mb-4">
                        Based on your spending, here are some tips:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Consider reducing dining out by 15%.</li>
                        <li>Look for cheaper internet plans.</li>
                        <li>Automate savings transfers.</li>
                    </ul>
                    <button className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                        Implement Tips
                    </button>
                </div>

                {/* Currency Exchange Card (Placeholder) */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-400">
                    <h2 className="text-2xl font-bold text-blue-800 mb-4">Currency Exchange</h2>
                    <p className="text-gray-700 mb-4">
                        Manage finances in multiple currencies. (API integration coming soon!)
                    </p>
                    <p className="text-gray-600">
                        Current Rates:
                        <br />
                        1 USD = 18.50 ZAR
                        <br />
                        1 EUR = 20.00 ZAR
                    </p>
                    <button className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                        Convert Currency
                    </button>
                </div>

                {/* Security & Privacy Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-400">
                    <h2 className="text-2xl font-bold text-blue-800 mb-4">Security & Privacy</h2>
                    <p className="text-gray-700 mb-4">
                        Your financial data is encrypted and protected.
                    </p>
                    <p className="text-gray-600">
                        Last Security Check: Today
                        <br />
                        Data Encryption: Active
                    </p>
                    <button className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                        Security Settings
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full max-w-6xl text-center text-gray-600 mt-10 py-4 border-t border-gray-300">
                &copy; {new Date().getFullYear()} BudgetEase. All rights reserved.
            </footer>
        </div>
    );
};

// --- Main App Component ---
const App = () => {
    const [currentUser, setCurrentUser] = useState(null);

    // Load user from session storage on initial render
    useEffect(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    // Login function: sets current user and stores in session storage
    const login = (user) => {
        setCurrentUser(user);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    };

    // Logout function: clears current user and session storage
    const logout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {/* Tailwind CSS CDN */}
            <script src="https://cdn.tailwindcss.com"></script>
            {/* Inter font for better aesthetics */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
            <style>
                {`
                body {
                    font-family: 'Inter', sans-serif;
                }
                `}
            </style>
            {currentUser ? <UserPage /> : <LoginPage />}
        </AuthContext.Provider>
    );
};

export default App;

