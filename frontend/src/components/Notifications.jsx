// frontend/src/components/Notifications.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const Notifications = () => {
    // You'd typically have a 'notifications' slice in Redux
    // For now, let's mock a simple budget overrun check
    const expenses = useSelector(state => state.expenses.expenses);
    const budgets = useSelector(state => state.budgets.budgets);

    const budgetOverrunAlerts = [];

    if (budgets.length > 0 && expenses.length > 0) {
        // Simple check: sum expenses per category and compare to budget limit
        const expensesByCategory = expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {});

        budgets.forEach(budget => {
            const spent = expensesByCategory[budget.category] || 0;
            if (spent > budget.limit) {
                budgetOverrunAlerts.push(
                    <div key={budget._id} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-3 rounded-md shadow-sm" role="alert">
                        <p className="font-bold">Budget Alert!</p>
                        <p>You have exceeded your '{budget.category}' budget by ${spent - budget.limit}.</p>
                    </div>
                );
            }
        });
    }

    return (
        <div className="w-full max-w-6xl mx-auto mt-6">
            {budgetOverrunAlerts.length > 0 ? (
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-red-800 mb-4">Urgent Alerts</h2>
                    {budgetOverrunAlerts}
                </div>
            ) : (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-3 rounded-md shadow-sm" role="alert">
                    <p className="font-bold">Good News!</p>
                    <p>No budget overruns detected. Keep up the great work!</p>
                </div>
            )}
        </div>
    );
};

export default Notifications;

