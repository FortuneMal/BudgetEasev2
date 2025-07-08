// frontend/src/components/Expenses/ExpensesPage.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from '../../redux/slices/expensesSlice';

const ExpensesPage = () => {
    const dispatch = useDispatch();
    const expenses = useSelector(state => state.expenses.expenses);
    const expensesStatus = useSelector(state => state.expenses.status);
    const expensesError = useSelector(state => state.expenses.error);
    const user = useSelector(state => state.auth.user); // Get user for context

    const [newExpense, setNewExpense] = useState({ amount: '', category: '', date: '', description: '' });
    const [editingExpense, setEditingExpense] = useState(null); // State to hold expense being edited
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility

    // Fetch expenses when the component mounts or user changes
    useEffect(() => {
        if (user && expensesStatus === 'idle') {
            dispatch(fetchExpenses());
        }
    }, [user, expensesStatus, dispatch]);

    // Handle input changes for the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewExpense(prev => ({ ...prev, [name]: value }));
    };

    // Handle adding/updating an expense
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingExpense) {
                // Update existing expense
                await dispatch(updateExpense({ _id: editingExpense._id, ...newExpense })).unwrap();
                setEditingExpense(null); // Clear editing state
            } else {
                // Add new expense
                await dispatch(addExpense(newExpense)).unwrap(); // .unwrap() to get the payload or throw error
            }
            setNewExpense({ amount: '', category: '', date: '', description: '' }); // Clear form
            setShowForm(false); // Hide form after submission
        } catch (error) {
            console.error('Failed to save expense:', error);
            alert(`Error saving expense: ${error.message}`); // Use a custom modal in a real app
        }
    };

    // Set expense for editing
    const handleEditClick = (expense) => {
        setEditingExpense(expense);
        setNewExpense({
            amount: expense.amount,
            category: expense.category,
            date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '', // Format date for input type="date"
            description: expense.description
        });
        setShowForm(true); // Show form for editing
    };

    // Handle deleting an expense
    const handleDeleteClick = async (expenseId) => {
        if (window.confirm('Are you sure you want to delete this expense?')) { // Use custom modal in real app
            try {
                await dispatch(deleteExpense(expenseId)).unwrap();
            } catch (error) {
                console.error('Failed to delete expense:', error);
                alert(`Error deleting expense: ${error.message}`); // Use a custom modal in a real app
            }
        }
    };

    if (!user) {
        return <p>Please log in to view expenses.</p>;
    }

    return (
        <div className="min-h-screen bg-blue-50 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border-b-4 border-budget-blue">
                <h1 className="text-3xl font-bold text-budget-blue-dark mb-6 text-center">Manage Your Expenses</h1>

                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingExpense(null); // Clear editing state when toggling form
                        setNewExpense({ amount: '', category: '', date: '', description: '' });
                    }}
                    className="mb-6 py-2 px-6 bg-budget-blue hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                    {showForm ? 'Hide Form' : 'Add New Expense'}
                </button>

                {showForm && (
                    <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                        <h2 className="text-xl font-semibold text-budget-blue-dark mb-4">
                            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                        </h2>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                value={newExpense.amount}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-budget-blue focus:border-budget-blue"
                                required
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={newExpense.category}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-budget-blue focus:border-budget-blue"
                                required
                            >
                                <option value="">Select a category</option>
                                <option value="Food">Food</option>
                                <option value="Transport">Transport</option>
                                <option value="Housing">Housing</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Health">Health</option>
                                <option value="Education">Education</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={newExpense.date}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-budget-blue focus:border-budget-blue"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                            <textarea
                                id="description"
                                name="description"
                                value={newExpense.description}
                                onChange={handleInputChange}
                                rows="2"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-budget-blue focus:border-budget-blue"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            {editingExpense ? 'Update Expense' : 'Add Expense'}
                        </button>
                        {editingExpense && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingExpense(null);
                                    setNewExpense({ amount: '', category: '', date: '', description: '' });
                                    setShowForm(false);
                                }}
                                className="w-full mt-2 py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>
                )}

                <h2 className="text-2xl font-bold text-budget-blue-dark mb-4 mt-8">Your Expenses</h2>
                {expensesStatus === 'loading' && <p className="text-budget-blue">Loading expenses...</p>}
                {expensesStatus === 'failed' && <p className="text-red-600">Error: {expensesError}</p>}
                {expensesStatus === 'succeeded' && expenses.length === 0 && (
                    <p className="text-gray-500">No expenses recorded yet.</p>
                )}
                {expensesStatus === 'succeeded' && expenses.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Category</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Description</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {expenses.map(expense => (
                                    <tr key={expense._id} className="hover:bg-blue-50">
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">${expense.amount.toFixed(2)}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{expense.category}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{expense.description}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEditClick(expense)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(expense._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpensesPage;

