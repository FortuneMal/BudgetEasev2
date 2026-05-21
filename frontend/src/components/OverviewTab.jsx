import React from 'react';
import { Home, ShoppingCart, Zap, Film, Coffee, Activity, ArrowRight } from 'lucide-react';
import RechartsSpendingChart from './RechartsSpendingChart';

const OverviewTab = ({ expenses, categoryBudgets, selectedCurrency, setActiveTab }) => {
  const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Home', 'Housing & Rent', 'Other'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: selectedCurrency,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-10 animate-fadeIn">
      {/* LEFT COLUMN: BUDGET PROGRESS & CHART */}
      <div className="xl:col-span-2 space-y-6 sm:space-y-10">
        {/* BUDGET PROGRESS */}
        <div className="glass-card rounded-2xl p-6 sm:p-10 relative overflow-hidden border-gold-gradient">
          <div className="flex justify-between items-center mb-10 border-b border-obsidian-700/50 pb-4">
            <h2 className="text-2xl font-serif text-white tracking-wide">Budget Allocation</h2>
            <button onClick={() => setActiveTab('expenses')} className="text-xs font-bold uppercase tracking-widest text-gold-500 hover:text-gold-400 transition-colors flex items-center gap-2 group">
              Manage Budgets <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="space-y-8">
            {categories.map((catString) => {
              const totalSpent = expenses.filter(exp => exp.category === catString).reduce((sum, exp) => sum + exp.amount, 0);
              const limit = categoryBudgets[catString] || 0;

              if (limit === 0 && totalSpent === 0) return null;

              const percentage = limit > 0 ? Math.min((totalSpent / limit) * 100, 100) : (totalSpent > 0 ? 100 : 0);
              const isOverBudget = limit > 0 && totalSpent > limit;
              const isWarning = limit > 0 && totalSpent > limit * 0.85 && !isOverBudget;

              let Icon = Activity;
              
              if (catString === 'Home' || catString === 'Housing & Rent') { Icon = Home; }
              else if (catString === 'Groceries') { Icon = ShoppingCart; }
              else if (catString === 'Utilities') { Icon = Zap; }
              else if (catString === 'Entertainment') { Icon = Film; }
              else if (catString === 'Transportation') { Icon = Coffee; }

              return (
                <div key={catString} className="w-full group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-obsidian-900 rounded-xl border border-obsidian-700 text-gold-500 shadow-inner group-hover:border-gold-500/30 transition-colors">
                        <Icon size={16} />
                      </div>
                      <div>
                        <span className="font-bold text-sm tracking-wide text-platinum-200">{catString}</span>
                        {isOverBudget ? (
                          <span className="block text-[10px] uppercase tracking-widest text-red-500 font-bold mt-1">Exceeded by {formatCurrency(totalSpent - limit)}</span>
                        ) : isWarning ? (
                          <span className="block text-[10px] uppercase tracking-widest text-gold-500 font-bold mt-1">Nearing limit</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-xl text-white">{formatCurrency(totalSpent)}</span>
                        {limit > 0 && <span className="text-xs font-bold tracking-wider text-platinum-500 uppercase">/ {formatCurrency(limit)}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-1.5 bg-obsidian-900 rounded-full overflow-hidden shadow-inner border border-obsidian-800">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${isOverBudget ? 'bg-red-500' : 'bg-gold-gradient'}`}
                      style={{ width: `${limit > 0 ? percentage : (totalSpent > 0 ? 100 : 0)}%` }}
                    >
                      <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {Object.keys(categoryBudgets).length === 0 && expenses.length === 0 && (
              <div className="text-center py-12 text-platinum-500">
                <p className="font-serif italic text-lg mb-4">No allocations established.</p>
                <button onClick={() => setActiveTab('expenses')} className="text-xs font-bold uppercase tracking-widest text-gold-500 border-b border-gold-500 hover:text-gold-400 pb-1">Establish your first budget</button>
              </div>
            )}
          </div>
        </div>

        {/* CHART MODULE */}
        <RechartsSpendingChart 
          expenses={expenses} 
          categoryBudgets={categoryBudgets} 
          selectedCurrency={selectedCurrency} 
        />
      </div>

      {/* RIGHT COLUMN: RECENT TRANSACTIONS */}
      <div className="glass-card rounded-2xl p-6 sm:p-10 relative flex flex-col h-full border-gold-gradient">
        <div className="flex justify-between items-center mb-8 border-b border-obsidian-700/50 pb-4">
          <h2 className="text-2xl font-serif text-white tracking-wide">Recent Activity</h2>
        </div>

        <div className="space-y-4 flex-1">
          {expenses.slice(0, 8).map((exp) => {
            let Icon = Activity;

            if (exp.category === 'Home' || exp.category === 'Housing & Rent') { Icon = Home; }
            else if (exp.category === 'Groceries') { Icon = ShoppingCart; }
            else if (exp.category === 'Utilities') { Icon = Zap; }
            else if (exp.category === 'Entertainment') { Icon = Film; }
            else if (exp.category === 'Transportation') { Icon = Coffee; }

            return (
              <div key={exp.id || exp._id} className="group flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer bg-obsidian-900/40 border border-transparent hover:border-gold-500/20 hover:bg-obsidian-800/60">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-obsidian-900 text-platinum-400 group-hover:text-gold-500 border border-obsidian-700 shadow-inner transition-colors">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-sm tracking-wide text-platinum-200 group-hover:text-white transition-colors">{exp.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-platinum-500">
                      {exp.category} &bull; {new Date(exp.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className="font-serif text-lg text-white">
                  -{formatCurrency(exp.amount)}
                </span>
              </div>
            )
          })}
          {expenses.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-platinum-500">
              <Activity size={32} className="mb-4 opacity-30 text-gold-500" />
              <p className="font-serif italic">No recent transactions.</p>
            </div>
          )}
        </div>

        {expenses.length > 0 && (
          <button
            onClick={() => setActiveTab('expenses')}
            className="w-full mt-8 py-4 rounded-xl border border-obsidian-600 text-xs font-bold uppercase tracking-widest text-platinum-300 hover:bg-obsidian-800 hover:text-gold-400 hover:border-gold-500/50 transition-all"
          >
            View Full Ledger
          </button>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
