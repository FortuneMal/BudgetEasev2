import React from 'react';
import { TrendingUp, TrendingDown, Activity, Wallet } from 'lucide-react';

const MetricCards = ({ totalIncome, totalExpenses, netSavings, remainingBudget, selectedCurrency }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: selectedCurrency,
    }).format(amount);
  };

  const isOverBudget = remainingBudget < 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {/* 1. Total Income Card */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden group glass-card-hover border-gold-gradient">
        <div className="absolute top-0 right-0 p-8 bg-gold-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 blur-xl"></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <h3 className="text-platinum-400 text-[10px] font-bold uppercase tracking-widest">Total Income</h3>
          <div className="p-2 bg-obsidian-900 rounded-lg text-gold-500 border border-obsidian-700 shadow-inner group-hover:border-gold-500/50 transition-colors">
            <TrendingUp size={16} />
          </div>
        </div>
        <p className="text-3xl font-serif text-white relative z-10 tracking-wide drop-shadow-md">
          {formatCurrency(totalIncome)}
        </p>
      </div>

      {/* 2. Total Expenses Card */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden group glass-card-hover border-gold-gradient">
        <div className="absolute top-0 right-0 p-8 bg-platinum-400/5 rounded-full group-hover:scale-150 transition-transform duration-700 blur-xl"></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <h3 className="text-platinum-400 text-[10px] font-bold uppercase tracking-widest">Total Expenses</h3>
          <div className="p-2 bg-obsidian-900 rounded-lg text-platinum-400 border border-obsidian-700 shadow-inner group-hover:border-platinum-500/50 transition-colors">
            <TrendingDown size={16} />
          </div>
        </div>
        <p className="text-3xl font-serif text-white relative z-10 tracking-wide drop-shadow-md">
          {formatCurrency(totalExpenses)}
        </p>
      </div>

      {/* 3. Net Cash Flow Card */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden group glass-card-hover border-gold-gradient">
        <div className="absolute top-0 right-0 p-8 bg-gold-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 blur-xl"></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <h3 className="text-platinum-400 text-[10px] font-bold uppercase tracking-widest">Net Cash Flow</h3>
          <div className="p-2 bg-obsidian-900 rounded-lg text-gold-400 border border-obsidian-700 shadow-inner group-hover:border-gold-500/50 transition-colors">
            <Activity size={16} />
          </div>
        </div>
        <p className="text-3xl font-serif text-white relative z-10 tracking-wide drop-shadow-md">
          {formatCurrency(netSavings)}
        </p>
      </div>

      {/* 4. Remaining Budget Card */}
      <div className={`glass-card rounded-2xl p-6 relative overflow-hidden group glass-card-hover ${isOverBudget ? 'border border-red-500/50' : 'border-gold-gradient'}`}>
        <div className={`absolute top-0 right-0 p-8 rounded-full group-hover:scale-150 transition-transform duration-700 blur-xl ${isOverBudget ? 'bg-red-500/10' : 'bg-platinum-400/5'}`}></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <h3 className="text-platinum-400 text-[10px] font-bold uppercase tracking-widest">Remaining Budget</h3>
          <div className={`p-2 bg-obsidian-900 rounded-lg border border-obsidian-700 shadow-inner transition-colors ${isOverBudget ? 'text-red-500 group-hover:border-red-500/50' : 'text-platinum-300 group-hover:border-platinum-500/50'}`}>
            <Wallet size={16} />
          </div>
        </div>
        <div className="relative z-10">
          <p className={`text-3xl font-serif tracking-wide drop-shadow-md ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
            {formatCurrency(remainingBudget)}
          </p>
          {isOverBudget && <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-widest animate-pulse">Exceeding Limits</p>}
        </div>
      </div>
    </div>
  );
};

export default MetricCards;
