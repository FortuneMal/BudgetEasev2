// frontend/src/components/charts/ExpenseCategoryChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSelector } from 'react-redux';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#ffc0cb'];

const ExpenseCategoryChart = () => {
    const expenses = useSelector(state => state.expenses.expenses);
    const expensesStatus = useSelector(state => state.expenses.status);

    if (expensesStatus !== 'succeeded' || expenses.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"> {/* Minimalist card styling */}
                <h2 className="text-2xl font-bold text-primary-dark mb-4">Expense Breakdown</h2>
                <p className="text-gray-500">No expense data to display chart.</p>
            </div>
        );
    }

    // Aggregate expenses by category
    const data = Object.entries(
        expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {})
    ).map(([name, value]) => ({ name, value }));

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"> {/* Minimalist card styling */}
            <h2 className="text-2xl font-bold text-primary-dark mb-4">Expense Breakdown by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpenseCategoryChart;

