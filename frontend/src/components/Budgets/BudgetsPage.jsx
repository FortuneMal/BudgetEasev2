// frontend/src/components/Budgets/BudgetsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBudgets, addBudget, updateBudget, deleteBudget } from '../../redux/slices/budgetsSlice.jsx';

const BudgetsPage = () => {
    const dispatch = useDispatch();
    const budgets = useSelector(state => state.budgets.budgets);
    const budgetsStatus = useSelector(state => state.budgets.status);
    const budgetsError = useSelector(state => state.budgets.error);
    const user = useSelector(state => state.auth.user);

    // Initialize newBudget with startDate and endDate
    const [newBudget, setNewBudget] = useState({ category: '', limit: '', startDate: '', endDate: '' });
    const [editingBudget, setEditingBudget] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Fetch budgets when the component mounts or user changes
    useEffect(() => {
        if (user && budgetsStatus === 'idle') {
            dispatch(fetchBudgets());
        }
    }, [user, budgetsStatus, dispatch]);

    // Handle input changes for the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBudget(prev => ({ ...prev, [name]: value }));
    };

    // Handle adding/updating a budget
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure limit is a number
            const budgetToSave = {
                ...newBudget,
                limit: parseFloat(newBudget.limit),
            };

            // --- DEBUG LOG: Check what's being sent ---
            console.log('Budget data being sent to backend:', budgetToSave);
            // --- END DEBUG LOG ---

            if (editingBudget) {
                // Update existing budget
                await dispatch(updateBudget({ _id: editingBudget._id, ...budgetToSave })).unwrap();
                setEditingBudget(null);
            } else {
                // Add new budget
                await dispatch(addBudget(budgetToSave)).unwrap();
            }
            // Clear form and hide it
            setNewBudget({ category: '', limit: '', startDate: '', endDate: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Failed to save budget:', error);
            alert(`Error saving budget: ${error.message}`);
        }
    };

    // Set budget for editing
    const handleEditClick = (budget) => {
        setEditingBudget(budget);
        setNewBudget({
            category: budget.category,
            limit: budget.limit,
            // Format dates for input type="date"
            startDate: budget.startDate ? new Date(budget.startDate).toISOString().split('T')[0] : '',
            endDate: budget.endDate ? new Date(budget.endDate).toISOString().split('T')[0] : '',
        });
        setShowForm(true);
    };

    // Handle deleting a budget
    const handleDeleteClick = async (budgetId) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            try {
                await dispatch(deleteBudget(budgetId)).unwrap();
            } catch (error) {
                console.error('Failed to delete budget:', error);
                alert(`Error deleting budget: ${error.message}`);
            }
        }
    };

    if (!user) {
        return <p>Please log in to view budgets.</p>;
    }

    return (
        <div className="min-h-screen bg-blue-50 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border-b-4 border-budget-blue">
                <h1 className="text-3xl font-bold text-budget-blue-dark mb-6 text-center">Manage Your Budgets</h1>

                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingBudget(null);
                        setNewBudget({ category: '', limit: '', startDate: '', endDate: '' });
                    }}
                    className="mb-6 py-2 px-6 bg-budget-blue hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                    {showForm ? 'Hide Form' : 'Add New Budget'}
                </button>

                {showForm && (
                    <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                        <h2 className="text-xl font-semibold text-budget-blue-dark mb-4">
                            {editingBudget ? 'Edit Budget' : 'Add New Budget'}
                        </h2>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={newBudget.category}
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
                                <option value="Overall">Overall</option> {/* Added for overall budget */}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="limit" className="block text-sm font-medium text-gray-700">Budget Limit ($)</label>
                            <input
                                type="number"
                                id="limit"
                                name="limit"
                                value={newBudget.limit}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-budget-blue focus:border-budget-blue"
                                required
                                step="0.01"
                            />
                        </div>
                        {/* New: Start Date Input */}
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={newBudget.startDate}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-budget-blue focus:border-budget-blue"
                                required
                            />
                        </div>
                        {/* New: End Date Input */}
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={newBudget.endDate}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-budget-blue focus:border-budget-blue"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            {editingBudget ? 'Update Budget' : 'Add Budget'}
                        </button>
                        {editingBudget && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingBudget(null);
                                    setNewBudget({ category: '', limit: '', startDate: '', endDate: '' });
                                    setShowForm(false);
                                }}
                                className="w-full mt-2 py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>
                )}

                <h2 className="text-2xl font-bold text-budget-blue-dark mb-4 mt-8">Your Budgets</h2>
                {budgetsStatus === 'loading' && <p className="text-budget-blue">Loading budgets...</p>}
                {budgetsStatus === 'failed' && <p className="text-red-600">Error: {budgetsError}</p>}
                {budgetsStatus === 'succeeded' && budgets.length === 0 && (
                    <p className="text-gray-500">No budgets defined yet. Start adding some!</p>
                )}
                {budgetsStatus === 'succeeded' && budgets.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">Category</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Limit</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Start Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">End Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {budgets.map(budget => (
                                    <tr key={budget._id} className="hover:bg-blue-50">
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{budget.category}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">${budget.limit.toFixed(2)}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{new Date(budget.startDate).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{new Date(budget.endDate).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEditClick(budget)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(budget._id)}
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

export default BudgetsPage;

