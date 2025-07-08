import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExpenses } from '../redux/slices/expensesSlice';
import Navbar from './Navbar'; // Assuming Navbar is now a separate component

const Dashboard = () => {
    const user = useSelector(state => state.auth.user);
    const expenses = useSelector(state => state.expenses.expenses);
    const expensesStatus = useSelector(state => state.expenses.status);
    const dispatch = useDispatch();

    useEffect(() => {
        if (expensesStatus === 'idle' && user) {
            dispatch(fetchExpenses(user.id)); // Fetch expenses for the logged-in user
        }
    }, [expensesStatus, dispatch, user]);

    if (!user) {
        return <p>Redirecting to login...</p>; // Handled by router but good fallback
    }

    return (
        <div className="min-h-screen bg-blue-50">
            {/* Navbar is rendered by App.js based on auth state, not here */}
            <main className="p-6 max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-blue-900 mb-8">
                    Welcome, {user.name}!
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Example: Displaying some expense data */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-400">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">Recent Expenses</h2>
                        {expensesStatus === 'loading' && <p>Loading expenses...</p>}
                        {expensesStatus === 'failed' && <p>Error loading expenses.</p>}
                        {expensesStatus === 'succeeded' && expenses.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                {expenses.slice(0, 3).map(exp => ( // Show first 3 for dashboard
                                    <li key={exp.id}>
                                        {exp.description} - ${exp.amount} ({exp.category})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            expensesStatus === 'succeeded' && <p>No expenses recorded yet.</p>
                        )}
                        <button className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                            View All Expenses
                        </button>
                    </div>
                    {/* Other dashboard cards (Budgets, Goals, Recommendations) */}
                    {/* ... (as in the UserPage from the demo, but now potentially separate components) */}
                </div>
            </main>
            {/* Footer component */}
        </div>
    );
};

export default Dashboard;

