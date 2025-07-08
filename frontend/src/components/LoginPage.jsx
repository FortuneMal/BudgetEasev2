// frontend/src/components/LoginPage.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice'; // Import the Redux action

// --- Login Page Component ---
const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch(); // Get the dispatch function

    // Handles the login form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        try {
            // Make API call to backend login endpoint
            const response = await fetch('http://localhost:3001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Dispatch the Redux action to store user data
                dispatch(loginUser(data)); // Assuming data contains the user object directly
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Network error or server is not running. Please check console for details.');
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

export default LoginPage;

