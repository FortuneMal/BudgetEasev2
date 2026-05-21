import React, { useState } from 'react';
import { TrendingUp, Trash2, Plus, Briefcase, Award, Heart, Gift, MoreHorizontal } from 'lucide-react';

const IncomeTab = ({ income, onAddIncome, onRemoveIncome, selectedMonth, selectedYear, selectedCurrency, theme }) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'];

  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');

  const formatCurrency = (val) => new Intl.NumberFormat(navigator.language, { style: 'currency', currency: selectedCurrency }).format(val);

  const filteredIncome = income.filter(inc => {
    const d = new Date(inc.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totalFilteredIncome = filteredIncome.reduce((sum, inc) => sum + inc.amount, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (source && amount) {
      onAddIncome({
        source,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString()
      });
      setSource('');
      setAmount('');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      
      <div className={`p-6 sm:p-8 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add Income Source</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-1">
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Source / Employer</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              placeholder="e.g. Acme Corp"
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors appearance-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
            >
              {incomeCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="md:col-span-3 pt-2">
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Log Income
            </button>
          </div>
        </form>
      </div>

      <div className={`p-6 sm:p-8 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200 dark:border-slate-700">
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Income History ({months[selectedMonth]} {selectedYear})
          </h3>
          <span className="text-xl font-extrabold font-['Outfit'] text-emerald-500">
            {formatCurrency(totalFilteredIncome)}
          </span>
        </div>

        <div className="space-y-4">
          {filteredIncome.map((inc, i) => {
            let Icon = Briefcase;
            let bgClass = 'bg-emerald-500/10';
            let colorClass = 'text-emerald-500';

            if (inc.category === 'Freelance') { Icon = TrendingUp; colorClass = 'text-indigo-500'; bgClass = 'bg-indigo-500/10'; }
            else if (inc.category === 'Investment') { Icon = Award; colorClass = 'text-blue-500'; bgClass = 'bg-blue-500/10'; }
            else if (inc.category === 'Gift') { Icon = Gift; colorClass = 'text-rose-500'; bgClass = 'bg-rose-500/10'; }
            else if (inc.category === 'Other') { Icon = MoreHorizontal; colorClass = 'text-gray-500'; bgClass = 'bg-gray-500/10'; }

            // Because we filter by month, we need to map back to the original array index for deletion
            const originalIndex = income.indexOf(inc);

            return (
              <div key={i} className={`flex justify-between items-center p-4 rounded-xl border transition-all hover:shadow-md ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{inc.source}</p>
                    <p className={`text-sm font-medium mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                      {inc.category} • {new Date(inc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-extrabold text-lg font-['Outfit'] text-emerald-500">
                    +{formatCurrency(inc.amount)}
                  </span>
                  <button
                    onClick={() => onRemoveIncome(originalIndex)}
                    className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/20' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                    title="Remove income source"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )
          })}

          {filteredIncome.length === 0 && (
            <div className={`text-center py-12 border-2 border-dashed rounded-xl ${theme === 'dark' ? 'border-slate-700 text-slate-500' : 'border-gray-200 text-gray-500'}`}>
              <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium">No income recorded for this month.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeTab;
