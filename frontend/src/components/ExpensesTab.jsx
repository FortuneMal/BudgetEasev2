import React, { useState, useEffect } from 'react';
import { ShoppingCart, Zap, Film, Home, Coffee, Activity, Edit2, Trash2, Plus } from 'lucide-react';

const ExpensesTab = ({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense, categoryBudgets, onSetBudget, selectedCurrency, theme }) => {
  const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Home', 'Housing & Rent', 'Other'];
  
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  
  // Expense Form State
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [isRecurring, setIsRecurring] = useState(false);

  // Budget Form State
  const [budgetCategory, setBudgetCategory] = useState(categories[0]);
  const [budgetAmount, setBudgetAmount] = useState('');

  const formatCurrency = (val) => new Intl.NumberFormat(navigator.language, { style: 'currency', currency: selectedCurrency }).format(val);

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    if (editingId) {
      onUpdateExpense({ id: editingId, _id: editingId, name, amount: parseFloat(amount), category, isRecurring });
      setEditingId(null);
    } else {
      onAddExpense({ name, amount: parseFloat(amount), category, isRecurring });
    }
    setName('');
    setAmount('');
    setIsRecurring(false);
  };

  const startEdit = (exp) => {
    setEditingId(exp.id || exp._id);
    setName(exp.name);
    setAmount(exp.amount.toString());
    setCategory(exp.category);
    setIsRecurring(exp.isRecurring || false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    if (budgetAmount) {
      onSetBudget(budgetCategory, parseFloat(budgetAmount));
      setBudgetAmount('');
    }
  };

  const filteredExpenses = expenses
    .filter(e => filterCategory === 'All' || e.category === filterCategory)
    .filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
    });

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      
      {/* TOP ROW: SET BUDGET & ADD EXPENSE FORMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ADD / EDIT EXPENSE FORM */}
        <div className={`p-6 sm:p-8 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {editingId ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <form onSubmit={handleExpenseSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Expense Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                  placeholder="e.g. Weekly Groceries"
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
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 transition-colors cursor-pointer"
              />
              <label htmlFor="isRecurring" className={`text-sm font-semibold cursor-pointer ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                Recurring Monthly Expense
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-lg shadow-emerald-500/20"
              >
                {editingId ? 'Save Changes' : 'Add Expense'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setName(''); setAmount(''); setIsRecurring(false); }}
                  className={`flex-1 font-bold py-3 px-4 rounded-xl transition duration-300 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* SET BUDGET FORM */}
        <div className={`p-6 sm:p-8 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Set Category Budget</h3>
          <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Define monthly spending limits for your categories to track progress.</p>
          
          <form onSubmit={handleBudgetSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Category</label>
              <select
                value={budgetCategory}
                onChange={(e) => setBudgetCategory(e.target.value)}
                className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors appearance-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-2 flex justify-between ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Budget Amount</span>
                {categoryBudgets[budgetCategory] && (
                  <span className="text-blue-500">Current: {formatCurrency(categoryBudgets[budgetCategory])}</span>
                )}
              </label>
              <input
                type="number"
                step="0.01"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                required
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-lg shadow-blue-500/20"
              >
                Set Budget
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* EXPENSE LIST & FILTERS */}
      <div className={`p-6 sm:p-8 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>All Transactions</h3>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full sm:w-48 rounded-xl px-4 py-2.5 border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full sm:w-40 rounded-xl px-4 py-2.5 border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors appearance-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full sm:w-36 rounded-xl px-4 py-2.5 border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors appearance-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
            >
              <option value="date_desc">Latest First</option>
              <option value="amount_desc">Highest Amount</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredExpenses.map((exp) => {
            let Icon = Activity;
            let colorClass = 'text-slate-500';
            let bgClass = 'bg-slate-500/10';

            if (exp.category === 'Home' || exp.category === 'Housing & Rent') { Icon = Home; colorClass = 'text-indigo-500'; bgClass = 'bg-indigo-500/10'; }
            else if (exp.category === 'Groceries') { Icon = ShoppingCart; colorClass = 'text-emerald-500'; bgClass = 'bg-emerald-500/10'; }
            else if (exp.category === 'Utilities') { Icon = Zap; colorClass = 'text-amber-500'; bgClass = 'bg-amber-500/10'; }
            else if (exp.category === 'Entertainment') { Icon = Film; colorClass = 'text-rose-500'; bgClass = 'bg-rose-500/10'; }
            else if (exp.category === 'Transportation') { Icon = Coffee; colorClass = 'text-blue-500'; bgClass = 'bg-blue-500/10'; }

            return (
              <div key={exp.id || exp._id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{exp.name}</p>
                      {exp.isRecurring && <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">Recurring</span>}
                    </div>
                    <p className={`text-sm font-medium mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                      {exp.category} • {new Date(exp.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-4 border-t sm:border-0 pt-4 sm:pt-0 border-gray-200 dark:border-slate-700">
                  <span className={`font-extrabold text-lg font-['Outfit'] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(exp.amount)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(exp)} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => onDeleteExpense(exp.id || exp._id)} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-rose-500/20 hover:text-rose-400' : 'text-gray-500 hover:bg-red-50 hover:text-red-600'}`}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredExpenses.length === 0 && (
            <div className={`text-center py-12 border-2 border-dashed rounded-xl ${theme === 'dark' ? 'border-slate-700 text-slate-500' : 'border-gray-200 text-gray-500'}`}>
              <Activity size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium">No expenses found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesTab;
