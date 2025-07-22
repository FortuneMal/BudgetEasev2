// frontend/src/components/LoginPage.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice.jsx';
import { Link } from 'react-router-dom'; // Import Link

// --- Login Page Component ---
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    // Handles the login form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                dispatch(loginUser(data));
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Network error or server is not running. Please check console for details.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
                <h2 className="text-4xl font-extrabold text-primary-dark text-center mb-8">
                    BudgetEase
                </h2>
                <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
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
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-lg outline-none"
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
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary text-lg outline-none"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-center text-md font-medium">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-primary text-white font-bold rounded-md shadow-sm transition duration-300 ease-in-out hover:bg-opacity-90 text-xl"
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
                <p className="mt-4 text-center text-gray-600 text-md">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:underline">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

