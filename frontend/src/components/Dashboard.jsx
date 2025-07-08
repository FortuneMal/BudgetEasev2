// frontend/src/components/Dashboard.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExpenses } from '../redux/slices/expensesSlice';
import { fetchBudgets } from '../redux/slices/budgetsSlice';
import { fetchGoals } from '../redux/slices/goalsSlice';
// Assuming Navbar is now a separate component and handled in App.jsx routing

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

    // Fetch expenses on component mount
    useEffect(() => {
        if (expensesStatus === 'idle' && user) {
            dispatch(fetchExpenses()); // No userId needed here, backend uses mock or JWT
        }
    }, [expensesStatus, dispatch, user]);

    // Fetch budgets on component mount
    useEffect(() => {
        if (budgetsStatus === 'idle' && user) {
            dispatch(fetchBudgets());
        }
    }, [budgetsStatus, dispatch, user]);

    // Fetch goals on component mount
    useEffect(() => {
        if (goalsStatus === 'idle' && user) {
            dispatch(fetchGoals());
        }
    }, [goalsStatus, dispatch, user]);


    if (!user) {
        // This case should ideally be handled by your router's Navigate component
        return <p>Please log in to view the dashboard.</p>;
    }

    return (
        <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center">
            {/* Header is now likely in App.js or a separate Layout component */}
            <header className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-lg flex justify-between items-center mb-8 border-b-4 border-budget-blue">
                <h1 className="text-4xl font-extrabold text-budget-blue-dark">
                    BudgetEase
                </h1>
                <div className="flex items-center space-x-4">
                    <span className="text-xl font-semibold text-budget-blue-dark">
                        Welcome, {user.name}!
                    </span>
                    {/* Logout button will be in Navbar or a top-level component */}
                </div>
            </header>

            <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Expense Categorization Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-budget-blue">
                    <h2 className="text-2xl font-bold text-budget-blue-dark mb-4">Expense Categorization</h2>
                    <p className="text-gray-700 mb-4">
                        Track where your money goes by categorizing your expenses.
                    </p>
                    {expensesStatus === 'loading' && <p className="text-budget-blue">Loading expenses...</p>}
                    {expensesStatus === 'failed' && <p className="text-red-600">Error: {expensesError}</p>}
                    {expensesStatus === 'succeeded' && expenses.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            {expenses.slice(0, 3).map(exp => ( // Show first 3 for dashboard summary
                                <li key={exp._id}>
                                    {exp.description || exp.category}: ${exp.amount} on {new Date(exp.date).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        expensesStatus === 'succeeded' && <p className="text-gray-500">No expenses recorded yet. Start adding some!</p>
                    )}
                    <button className="mt-4 py-2 px-4 bg-budget-blue hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                        View All Expenses
                    </button>
                </div>

                {/* Budget Tracking Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-budget-blue">
                    <h2 className="text-2xl font-bold text-budget-blue-dark mb-4">Budget Tracking</h2>
                    <p className="text-gray-700 mb-4">
                        Monitor your spending against your set budgets.
                    </p>
                    {budgetsStatus === 'loading' && <p className="text-budget-blue">Loading budgets...</p>}
                    {budgetsStatus === 'failed' && <p className="text-red-600">Error: {budgetsError}</p>}
                    {budgetsStatus === 'succeeded' && budgets.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            {budgets.slice(0, 2).map(budget => ( // Show first 2 for dashboard summary
                                <li key={budget._id}>
                                    {budget.category} Budget: ${budget.limit}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        budgetsStatus === 'succeeded' && <p className="text-gray-500">No budgets set up yet.</p>
                    )}
                    <button className="mt-4 py-2 px-4 bg-budget-blue hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                        Manage Budgets
                    </button>
                </div>

                {/* Savings Goals Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-budget-blue">
                    <h2 className="text-2xl font-bold text-budget-blue-dark mb-4">Savings Goals</h2>
                    <p className="text-gray-700 mb-4">
                        Set and track your progress towards financial goals.
                    </p>
                    {goalsStatus === 'loading' && <p className="text-budget-blue">Loading goals...</p>}
                    {goalsStatus === 'failed' && <p className="text-red-600">Error: {goalsError}</p>}
                    {goalsStatus === 'succeeded' && goals.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                            {goals.slice(0, 2).map(goal => ( // Show first 2 for dashboard summary
                                <li key={goal._id}>
                                    {goal.name}: ${goal.savedAmount} / ${goal.targetAmount}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        goalsStatus === 'succeeded' && <p className="text-gray-500">No savings goals defined yet.</p>
                    )}
                    <button className="mt-4 py-2 px-4 bg-budget-blue hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
                        Add New Goal
                    </button>
                </div>

                {/* Placeholder for other cards (Recommendations, Currency Exchange, Security) */}
                {/* ... (as in the original UserPage, but now potentially separate components) */}
            </main>

            {/* Footer */}
            <footer className="w-full max-w-6xl text-center text-gray-600 mt-10 py-4 border-t border-gray-300">
                &copy; {new Date().getFullYear()} BudgetEase. All rights reserved.
            </footer>
        </div>
    );
};

export default Dashboard;

