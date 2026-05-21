import React from 'react';
import { TrendingUp, TrendingDown, Activity, Wallet } from 'lucide-react';

const MetricCards = ({ totalIncome, totalExpenses, netSavings, remainingBudget, selectedCurrency, theme }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: selectedCurrency,
    }).format(amount);
  };

  const isOverBudget = remainingBudget < 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {/* 1. Total Income Card */}
      <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300`}>
        <div className="absolute -top-4 -right-4 p-8 bg-emerald-500/5 rounded-full group-hover:scale-110 transition-transform"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <h3 className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} text-xs font-bold uppercase tracking-wider`}>Total Income</h3>
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
            <TrendingUp size={20} />
          </div>
        </div>
        <p className={`text-3xl font-bold font-['Outfit'] relative z-10 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {formatCurrency(totalIncome)}
        </p>
      </div>

      {/* 2. Total Expenses Card */}
      <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300`}>
        <div className="absolute -top-4 -right-4 p-8 bg-rose-500/5 rounded-full group-hover:scale-110 transition-transform"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <h3 className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} text-xs font-bold uppercase tracking-wider`}>Total Expenses</h3>
          <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
            <TrendingDown size={20} />
          </div>
        </div>
        <p className={`text-3xl font-bold font-['Outfit'] relative z-10 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {formatCurrency(totalExpenses)}
        </p>
      </div>

      {/* 3. Net Cash Flow Card */}
      <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300`}>
        <div className="absolute -top-4 -right-4 p-8 bg-blue-500/5 rounded-full group-hover:scale-110 transition-transform"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <h3 className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} text-xs font-bold uppercase tracking-wider`}>Net Cash Flow</h3>
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
            <Activity size={20} />
          </div>
        </div>
        <p className={`text-3xl font-bold font-['Outfit'] relative z-10 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {formatCurrency(netSavings)}
        </p>
      </div>

      {/* 4. Remaining Budget Card */}
      <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} rounded-2xl p-6 border shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300`}>
        <div className={`absolute -top-4 -right-4 p-8 rounded-full group-hover:scale-110 transition-transform ${isOverBudget ? 'bg-red-500/10' : 'bg-purple-500/5'}`}></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <h3 className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'} text-xs font-bold uppercase tracking-wider`}>Remaining Budget</h3>
          <div className={`p-2 rounded-lg ${isOverBudget ? 'bg-red-500/10 text-red-500' : 'bg-purple-500/10 text-purple-500'}`}>
            <Wallet size={20} />
          </div>
        </div>
        <div className="relative z-10">
          <p className={`text-3xl font-bold font-['Outfit'] ${isOverBudget ? 'text-red-500' : (theme === 'dark' ? 'text-white' : 'text-gray-900')}`}>
            {formatCurrency(remainingBudget)}
          </p>
          {isOverBudget && <p className="text-xs text-red-500 mt-1 font-semibold animate-pulse">Over Budget</p>}
        </div>
      </div>
    </div>
  );
};

export default MetricCards;
