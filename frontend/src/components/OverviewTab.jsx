import React from 'react';
import { Home, ShoppingCart, Zap, Film, Coffee, Activity } from 'lucide-react';
import RechartsSpendingChart from './RechartsSpendingChart';

const OverviewTab = ({ expenses, categoryBudgets, selectedCurrency, theme, setActiveTab }) => {
  const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Home', 'Housing & Rent', 'Other'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: selectedCurrency,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 animate-fadeIn">
      {/* LEFT COLUMN: BUDGET PROGRESS & CHART */}
      <div className="xl:col-span-2 space-y-6 sm:space-y-8">
        {/* BUDGET PROGRESS */}
        <div className={`rounded-2xl p-6 sm:p-8 border shadow-lg ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Budget Progress</h2>
            <button onClick={() => setActiveTab('expenses')} className="text-sm font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">Manage Budgets &rarr;</button>
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
              let colorClass = 'bg-slate-500';
              let iconColorClass = 'text-slate-500';
              
              if (catString === 'Home' || catString === 'Housing & Rent') { Icon = Home; colorClass = 'bg-indigo-500'; iconColorClass = 'text-indigo-500'; }
              else if (catString === 'Groceries') { Icon = ShoppingCart; colorClass = 'bg-emerald-500'; iconColorClass = 'text-emerald-500'; }
              else if (catString === 'Utilities') { Icon = Zap; colorClass = 'bg-amber-500'; iconColorClass = 'text-amber-500'; }
              else if (catString === 'Entertainment') { Icon = Film; colorClass = 'bg-rose-500'; iconColorClass = 'text-rose-500'; }
              else if (catString === 'Transportation') { Icon = Coffee; colorClass = 'bg-blue-500'; iconColorClass = 'text-blue-500'; }

              return (
                <div key={catString} className="w-full group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'} ${iconColorClass}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <span className={`font-bold block ${theme === 'dark' ? 'text-slate-200' : 'text-gray-800'}`}>{catString}</span>
                        {isOverBudget ? (
                          <span className="text-xs text-rose-500 font-medium">Over budget by {formatCurrency(totalSpent - limit)}</span>
                        ) : isWarning ? (
                          <span className="text-xs text-amber-500 font-medium">Approaching limit</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5">
                        <span className={`font-extrabold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(totalSpent)}</span>
                        {limit > 0 && <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>/ {formatCurrency(limit)}</span>}
                      </div>
                    </div>
                  </div>

                  <div className={`w-full rounded-full h-3 overflow-hidden border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-200 border-gray-300'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${isOverBudget ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : colorClass}`}
                      style={{ width: `${limit > 0 ? percentage : (totalSpent > 0 ? 100 : 0)}%` }}
                    >
                      <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {Object.keys(categoryBudgets).length === 0 && expenses.length === 0 && (
              <div className={`text-center py-8 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                <p>No budgets or expenses found.</p>
                <button onClick={() => setActiveTab('expenses')} className="mt-4 text-emerald-500 font-semibold hover:underline">Set up a budget</button>
              </div>
            )}
          </div>
        </div>

        {/* CHART MODULE */}
        <RechartsSpendingChart 
          expenses={expenses} 
          categoryBudgets={categoryBudgets} 
          selectedCurrency={selectedCurrency} 
          theme={theme} 
        />
      </div>

      {/* RIGHT COLUMN: RECENT TRANSACTIONS */}
      <div className={`rounded-2xl p-6 sm:p-8 border shadow-lg flex flex-col h-full ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
        </div>

        <div className="space-y-5 flex-1">
          {expenses.slice(0, 8).map((exp) => {
            let Icon = Activity;
            let colorClass = 'text-slate-500';
            let bgClass = 'bg-slate-500/10';

            if (exp.category === 'Home' || exp.category === 'Housing & Rent') { Icon = Home; colorClass = 'text-indigo-500'; bgClass = 'bg-indigo-500/10'; }
            else if (exp.category === 'Groceries') { Icon = ShoppingCart; colorClass = 'text-emerald-500'; bgClass = 'bg-emerald-500/10'; }
            else if (exp.category === 'Utilities') { Icon = Zap; colorClass = 'text-amber-500'; bgClass = 'bg-amber-500/10'; }
            else if (exp.category === 'Entertainment') { Icon = Film; colorClass = 'text-rose-500'; bgClass = 'bg-rose-500/10'; }
            else if (exp.category === 'Transportation') { Icon = Coffee; colorClass = 'text-blue-500'; bgClass = 'bg-blue-500/10'; }

            return (
              <div key={exp.id || exp._id} className={`flex items-center justify-between p-3.5 rounded-xl transition-all border border-transparent cursor-pointer ${theme === 'dark' ? 'hover:bg-slate-800/80 hover:border-slate-700' : 'hover:bg-gray-50 hover:border-gray-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm sm:text-base ${theme === 'dark' ? 'text-slate-200' : 'text-gray-900'}`}>{exp.name}</p>
                    <p className={`text-xs font-medium mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
                      {exp.category} • {new Date(exp.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className={`font-extrabold text-sm sm:text-base font-['Outfit'] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  -{formatCurrency(exp.amount)}
                </span>
              </div>
            )
          })}
          {expenses.length === 0 && (
            <div className={`flex flex-col items-center justify-center h-full text-center ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
              <Activity size={48} className="mb-4 opacity-20" />
              <p>No recent expenses.</p>
            </div>
          )}
        </div>

        {expenses.length > 0 && (
          <button
            onClick={() => setActiveTab('expenses')}
            className={`w-full mt-8 py-3.5 rounded-xl border-2 font-bold text-sm transition-colors ${theme === 'dark'
              ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
          >
            View All Transactions
          </button>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
