import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Luxury palette for charts
const COLORS = ['#d4af37', '#e6c365', '#b8942b', '#8f701c', '#fceda8', '#f8f9fa', '#adb5bd'];

const RechartsSpendingChart = ({ expenses, categoryBudgets, selectedCurrency }) => {
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
  }).filter(item => item.Spent > 0 || item.Budget > 0);

  // Custom Tooltip for premium feel
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-5 rounded-2xl border border-obsidian-600 shadow-2xl backdrop-blur-xl bg-obsidian-900/90 text-white">
          <p className="font-serif text-lg tracking-wide mb-3">{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-platinum-300 mb-1">
              <div className="w-2 h-2 rounded-full shadow-[0_0_5px_rgba(212,175,55,0.5)]" style={{ backgroundColor: entry.color }} />
              <span className="flex-1">{entry.name}:</span>
              <span className="text-white font-serif tracking-normal text-sm">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center rounded-2xl border border-obsidian-700 bg-obsidian-900/40">
        <p className="text-sm font-serif italic text-platinum-500">Insufficient data for visualization.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 sm:p-10 rounded-2xl relative border-gold-gradient">
      <div className="flex justify-between items-center mb-8 border-b border-obsidian-700/50 pb-4">
        <h3 className="text-2xl font-serif text-white tracking-wide">Wealth Distribution</h3>
        <div className="flex rounded-lg p-1 bg-obsidian-900 border border-obsidian-700">
          <button 
            onClick={() => setChartType('bar')}
            className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-md transition-all ${chartType === 'bar' ? 'bg-obsidian-700 text-gold-400 shadow-sm' : 'text-platinum-500 hover:text-platinum-300'}`}
          >
            Compare
          </button>
          <button 
            onClick={() => setChartType('pie')}
            className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-md transition-all ${chartType === 'pie' ? 'bg-obsidian-700 text-gold-400 shadow-sm' : 'text-platinum-500 hover:text-platinum-300'}`}
          >
            Breakdown
          </button>
        </div>
      </div>

      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d2d2d" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#adb5bd', fontSize: 10, fontFamily: 'Outfit' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#adb5bd', fontSize: 10, fontFamily: 'Outfit' }} tickFormatter={(value) => value > 0 ? value : ''} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#1a1a1a' }} />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontFamily: 'Outfit', color: '#adb5bd' }} />
              <Bar dataKey="Budget" fill="#2d2d2d" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="Spent" fill="#d4af37" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={5}
                dataKey="Spent"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none cursor-pointer drop-shadow-md" />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontFamily: 'Outfit', color: '#adb5bd' }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RechartsSpendingChart;
