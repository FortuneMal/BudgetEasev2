// frontend/src/components/Dashboard.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExpenses } from '../redux/slices/expensesSlice.jsx';
import { fetchBudgets } from '../redux/slices/budgetsSlice.jsx';
import { fetchGoals } from '../redux/slices/goalsSlice.jsx';
import CurrencyConverter from './CurrencyConverter.jsx'; // Assuming this exists
import Notifications from './Notifications.jsx';     // Assuming this exists
import ExpenseCategoryChart from './charts/ExpenseCategoryChart.jsx'; // Assuming this exists

const Dashboard = () => {
    const user = useSelector(state => state.auth.user);
    const expenses = useSelector(state => state.expenses.expenses);
    const expensesStatus = useSelector(state => state.expenses.status);
    const expensesError = useSelector(state => state.expenses.error);

    const budgets = useSelector(state => state.budgets.budgets);
    const budgetsStatus = useSelector(state => state.budgets.status);
    const budgetsError = useSelector(state => state.budgets.error);

    const goals = useSelector(state => state.goals.goals);
    const goalsStatus = useSelector(state => state.goals.status);
    const goalsError = useSelector(state => state.goals.error);

    const dispatch = useDispatch();

    useEffect(() => {
        if (expensesStatus === 'idle' && user) {
            dispatch(fetchExpenses());
        }
    }, [expensesStatus, dispatch, user]);

    useEffect(() => {
        if (budgetsStatus === 'idle' && user) {
            dispatch(fetchBudgets());
        }
    }, [budgetsStatus, dispatch, user]);

    useEffect(() => {
        if (goalsStatus === 'idle' && user) {
            dispatch(fetchGoals());
        }
    }, [goalsStatus, dispatch, user]);

    if (!user) {
        return <p>Please log in to view the dashboard.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center"> {/* Light gray background */}
            <header className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-sm flex justify-between items-center mb-8 border border-gray-200"> {/* White background, subtle shadow, light border */}
                <h1 className="text-4xl font-extrabold text-primary-dark"> {/* Custom primary-dark color */}
                    BudgetEase
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-xl font-semibold text-gray-700"> {/* Muted text */}
                        Welcome, {user.name}!
                    </span>
                </div>
            </header>

            <Notifications /> {/* Assuming Notifications component exists and is styled separately */}

            <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Expense Categorization Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"> {/* Subtle border and shadow */}
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">Expense Categorization</h2>
                    <p className="text-gray-700 mb-4">
                        Track where your money goes by categorizing your expenses.
                    </p>
                    {expensesStatus === 'loading' && <p className="text-primary">Loading expenses...</p>}
                    {expensesStatus === 'failed' && <p className="text-red-500">Error: {expensesError}</p>}
                    {expensesStatus === 'succeeded' && expenses.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            {expenses.slice(0, 3).map(exp => (
                                <li key={exp._id}>
                                    {exp.description || exp.category}: ${exp.amount} on {new Date(exp.date).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        expensesStatus === 'succeeded' && <p className="text-gray-500">No expenses recorded yet. Start adding some!</p>
                    )}
                    <Link to="/expenses" className="inline-block mt-4 py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-sm transition duration-300 ease-in-out hover:bg-opacity-90"> {/* Custom primary color, subtle hover */}
                        View All Expenses
                    </Link>
                </div>

                {/* Budget Tracking Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">Budget Tracking</h2>
                    <p className="text-gray-700 mb-4">
                        Monitor your spending against your set budgets.
                    </p>
                    {budgetsStatus === 'loading' && <p className="text-primary">Loading budgets...</p>}
                    {budgetsStatus === 'failed' && <p className="text-red-500">Error: {budgetsError}</p>}
                    {budgetsStatus === 'succeeded' && budgets.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            {budgets.slice(0, 2).map(budget => (
                                <li key={budget._id}>
                                    {budget.category} Budget: ${budget.limit}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        budgetsStatus === 'succeeded' && <p className="text-gray-500">No budgets set up yet.</p>
                    )}
                    <Link to="/budgets" className="inline-block mt-4 py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-sm transition duration-300 ease-in-out hover:bg-opacity-90">
                        Manage Budgets
                    </Link>
                </div>

                {/* Savings Goals Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">Savings Goals</h2>
                    <p className="text-gray-700 mb-4">
                        Set and track your progress towards financial goals.
                    </p>
                    {goalsStatus === 'loading' && <p className="text-primary">Loading goals...</p>}
                    {goalsStatus === 'failed' && <p className="text-red-500">Error: {goalsError}</p>}
                    {goalsStatus === 'succeeded' && goals.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            {goals.slice(0, 2).map(goal => (
                                <li key={goal._id}>
                                    {goal.name}: ${goal.savedAmount} / ${goal.targetAmount}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        goalsStatus === 'succeeded' && <p className="text-gray-500">No savings goals defined yet.</p>
                    )}
                    <Link to="/goals" className="inline-block mt-4 py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-sm transition duration-300 ease-in-out hover:bg-opacity-90">
                        Add New Goal
                    </Link>
                </div>

                {/* Currency Converter Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">Currency Converter</h2>
                    <CurrencyConverter />
                </div>

                {/* Expense Chart Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">Expense Breakdown by Category</h2>
                    <ExpenseCategoryChart />
                </div>

                {/* Personalized Recommendations Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">Personalized Recommendations</h2>
                    <p className="text-gray-700 mb-4">
                        Based on your spending, here are some tips:
                    </p>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li>Consider reducing dining out by 15%.</li>
                        <li>Look for cheaper internet plans.</li>
                        <li>Automate savings transfers.</li>
                    </ul>
                    <button className="mt-4 py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-sm transition duration-300 ease-in-out hover:bg-opacity-90">
                        Implement Tips
                    </button>
                </div>

                {/* Security & Privacy Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-primary-dark mb-4">Security & Privacy</h2>
                    <p className="text-gray-700 mb-4">
                        Your financial data is encrypted and protected.
                    </p>
                    <p className="text-gray-600">
                        Last Security Check: Today
                        <br />
                        Data Encryption: Active
                    </p>
                    <button className="mt-4 py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-sm transition duration-300 ease-in-out hover:bg-opacity-90">
                        Security Settings
                    </button>
                </div>
            </main>

            <footer className="w-full max-w-6xl text-center text-gray-600 mt-10 py-4 border-t border-gray-200">
                &copy; {new Date().getFullYear()} BudgetEase. All rights reserved.
            </footer>
        </div>
    );
};

export default Dashboard;

