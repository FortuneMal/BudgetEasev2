// frontend/src/components/Goals/SavingsGoalsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGoals, addGoal, updateGoal, deleteGoal } from '../../redux/slices/goalsSlice.jsx';

const SavingsGoalsPage = () => {
    const dispatch = useDispatch();
    const goals = useSelector(state => state.goals.goals);
    const goalsStatus = useSelector(state => state.goals.status);
    const goalsError = useSelector(state => state.goals.error);
    const user = useSelector(state => state.auth.user);

    const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '', savedAmount: '', targetDate: '' });
    const [editingGoal, setEditingGoal] = useState(null); // State to hold goal being edited
    const [showForm, setShowForm] = useState(false); // State to toggle form visibility

    // Fetch goals when the component mounts or user changes
    useEffect(() => {
        if (user && goalsStatus === 'idle') {
            dispatch(fetchGoals());
        }
    }, [user, goalsStatus, dispatch]);

    // Handle input changes for the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGoal(prev => ({ ...prev, [name]: value }));
    };

    // Handle adding/updating a goal
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const goalToSave = {
                ...newGoal,
                targetAmount: parseFloat(newGoal.targetAmount),
                savedAmount: parseFloat(newGoal.savedAmount) || 0, // Ensure savedAmount is a number, default to 0
            };

            if (editingGoal) {
                // Update existing goal
                await dispatch(updateGoal({ _id: editingGoal._id, ...goalToSave })).unwrap();
                setEditingGoal(null); // Clear editing state
            } else {
                // Add new goal
                await dispatch(addGoal(goalToSave)).unwrap(); // .unwrap() to get the payload or throw error
            }
            setNewGoal({ name: '', targetAmount: '', savedAmount: '', targetDate: '' }); // Clear form
            setShowForm(false); // Hide form after submission
        } catch (error) {
            console.error('Failed to save goal:', error);
            alert(`Error saving goal: ${error.message}`); // Use a custom modal in a real app
        }
    };

    // Set goal for editing
    const handleEditClick = (goal) => {
        setEditingGoal(goal);
        setNewGoal({
            name: goal.name,
            targetAmount: goal.targetAmount,
            savedAmount: goal.savedAmount,
            targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : '', // Format date for input type="date"
        });
        setShowForm(true); // Show form for editing
    };

    // Handle deleting a goal
    const handleDeleteClick = async (goalId) => {
        if (window.confirm('Are you sure you want to delete this goal?')) { // Use custom modal in real app
            try {
                await dispatch(deleteGoal(goalId)).unwrap();
            } catch (error) {
                console.error('Failed to delete goal:', error);
                alert(`Error deleting goal: ${error.message}`); // Use a custom modal in a real app
            }
        }
    };

    if (!user) {
        return <p>Please log in to view savings goals.</p>;
    }

    return (
        <div className="min-h-screen bg-blue-50 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border-b-4 border-budget-blue">
                <h1 className="text-3xl font-bold text-budget-blue-dark mb-6 text-center">Manage Your Savings Goals</h1>

                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingGoal(null); // Clear editing state when toggling form
                        setNewGoal({ name: '', targetAmount: '', savedAmount: '', targetDate: '' });
                    }}
                    className="mb-6 py-2 px-6 bg-budget-blue hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                    {showForm ? 'Hide Form' : 'Add New Goal'}
                </button>

                {showForm && (
                    <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                        <h2 className="text-xl font-semibold text-budget-blue-dark mb-4">
                            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
                        </h2>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Goal Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newGoal.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-budget-blue focus:border-budget-blue"
                                placeholder="e.g., New Car, Down Payment"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">Target Amount ($)</label>
                            <input
                                type="number"
                                id="targetAmount"
                                name="targetAmount"
                                value={newGoal.targetAmount}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-budget-blue focus:border-budget-blue"
                                required
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label htmlFor="savedAmount" className="block text-sm font-medium text-gray-700">Amount Saved ($)</label>
                            <input
                                type="number"
                                id="savedAmount"
                                name="savedAmount"
                                value={newGoal.savedAmount}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-budget-blue focus:border-budget-blue"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">Target Date</label>
                            <input
                                type="date"
                                id="targetDate"
                                name="targetDate"
                                value={newGoal.targetDate}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-budget-blue focus:border-budget-blue"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            {editingGoal ? 'Update Goal' : 'Add Goal'}
                        </button>
                        {editingGoal && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingGoal(null);
                                    setNewGoal({ name: '', targetAmount: '', savedAmount: '', targetDate: '' });
                                    setShowForm(false);
                                }}
                                className="w-full mt-2 py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>
                )}

                <h2 className="text-2xl font-bold text-budget-blue-dark mb-4 mt-8">Your Savings Goals</h2>
                {goalsStatus === 'loading' && <p className="text-budget-blue">Loading goals...</p>}
                {goalsStatus === 'failed' && <p className="text-red-600">Error: {goalsError}</p>}
                {goalsStatus === 'succeeded' && goals.length === 0 && (
                    <p className="text-gray-500">No savings goals defined yet. Start adding some!</p>
                )}
                {goalsStatus === 'succeeded' && goals.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">Goal Name</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Target Amount</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Saved Amount</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Progress</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Target Date</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {goals.map(goal => {
                                    const progress = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
                                    return (
                                        <tr key={goal._id} className="hover:bg-blue-50">
                                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{goal.name}</td>
                                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">${goal.targetAmount.toFixed(2)}</td>
                                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">${goal.savedAmount.toFixed(2)}</td>
                                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                                                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-green-600 h-2.5 rounded-full"
                                                        style={{ width: `${Math.min(100, progress).toFixed(0)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="ml-2">{progress.toFixed(0)}%</span>
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{new Date(goal.targetDate).toLocaleDateString()}</td>
                                            <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEditClick(goal)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(goal._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavingsGoalsPage;

