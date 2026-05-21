import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6', '#f43f5e'];

const RechartsSpendingChart = ({ expenses, categoryBudgets, selectedCurrency, theme }) => {
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'pie'
  const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Home', 'Housing & Rent', 'Other'];
  
  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: selectedCurrency,
    }).format(amount);
  };

  // Aggregate data
  const data = categories.map(cat => {
    const totalSpent = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    const budget = categoryBudgets[cat] || 0;
    return {
      name: cat,
      Spent: totalSpent,
      Budget: budget,
    };
  }).filter(item => item.Spent > 0 || item.Budget > 0); // Only show active categories

  // Custom Tooltip for premium feel
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-xl border shadow-xl backdrop-blur-md ${theme === 'dark' ? 'bg-slate-800/90 border-slate-700 text-white' : 'bg-white/90 border-gray-200 text-gray-900'}`}>
          <p className="font-bold mb-2">{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm font-medium">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="capitalize">{entry.name}:</span>
              <span>{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className={`h-64 flex items-center justify-center rounded-xl border ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}>
        <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>No spending data to visualize yet.</p>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Spending Analytics</h3>
        <div className={`flex rounded-lg p-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
          <button 
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${chartType === 'bar' ? (theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700')}`}
          >
            Comparison
          </button>
          <button 
            onClick={() => setChartType('pie')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${chartType === 'pie' ? (theme === 'dark' ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700')}`}
          >
            Breakdown
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }} tickFormatter={(value) => value > 0 ? value : ''} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f1f5f9' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Budget" fill={theme === 'dark' ? '#334155' : '#cbd5e1'} radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="Spent" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="Spent"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RechartsSpendingChart;
