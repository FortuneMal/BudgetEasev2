import React, { useState, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { ShoppingCart, Zap, Film, Home, Coffee, Activity, Edit2, Trash2, Wand2, UploadCloud, Loader2 } from 'lucide-react';

const ExpensesTab = ({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense, categoryBudgets, onSetBudget, selectedCurrency }) => {
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

  // AI State
  const [smartInput, setSmartInput] = useState('');
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [isParsingReceipt, setIsParsingReceipt] = useState(false);
  const [aiError, setAiError] = useState(null);
  const fileInputRef = useRef(null);

  // Budget Form State
  const [budgetCategory, setBudgetCategory] = useState(categories[0]);
  const [budgetAmount, setBudgetAmount] = useState('');

  const formatCurrency = (val) => new Intl.NumberFormat(navigator.language, { style: 'currency', currency: selectedCurrency }).format(val);

  // AI Methods
  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  const handleSmartCategorize = async (e) => {
    e.preventDefault();
    if (!smartInput.trim()) return;
    
    setIsCategorizing(true);
    setAiError(null);
    try {
      const token = await getAuthToken();
      const res = await fetch('http://localhost:5000/api/ai/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ natural_language_input: smartInput })
      });
      
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'AI Failed');

      const data = result.data;
      // Pre-fill form
      setName(data.merchant || 'Unknown');
      setAmount(data.amount?.toString() || '');
      setCategory(categories.includes(data.category) ? data.category : 'Other');
      setIsRecurring(data.isRecurring || false);
      setSmartInput('');
      
      // Auto-submit immediately for magical UX
      onAddExpense({ 
        name: data.merchant || 'Unknown', 
        amount: parseFloat(data.amount || 0), 
        category: categories.includes(data.category) ? data.category : 'Other', 
        isRecurring: data.isRecurring || false 
      });

    } catch (err) {
      setAiError(err.message);
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsParsingReceipt(true);
    setAiError(null);

    try {
      // 1. Upload to Supabase Storage
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) throw new Error('Not authenticated');

      const fileName = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, file);

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      // 3. Send URL to Backend AI parser
      const token = session.access_token;
      const res = await fetch('http://localhost:5000/api/ai/parse-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ storage_url: publicUrl })
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'AI Failed');

      const data = result.data;
      // Pre-fill form (wait for user confirmation instead of auto-submitting for receipts)
      setName(data.merchant || 'Scanned Receipt');
      setAmount(data.amount?.toString() || '');
      setCategory(categories.includes(data.category) ? data.category : 'Other');
      
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      setAiError(err.message);
    } finally {
      setIsParsingReceipt(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Standard Form Handlers
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
    <div className="space-y-10 animate-fadeIn max-w-5xl mx-auto relative z-10">
      
      {aiError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-medium shadow-lg backdrop-blur-sm">
          Intelligent Processing Error: {aiError}
        </div>
      )}

      {/* INTELLIGENT INPUT SECTION */}
      {!editingId && (
        <div className="glass-card p-6 rounded-2xl relative border-gold-gradient overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wand2 size={100} />
          </div>
          <h3 className="text-xl font-serif text-white mb-4 tracking-wide flex items-center gap-2">
            <Wand2 size={20} className="text-gold-500" />
            Intelligent Capture
          </h3>
          
          <div className="flex flex-col md:flex-row gap-6">
            <form onSubmit={handleSmartCategorize} className="flex-1 relative">
              <input
                type="text"
                value={smartInput}
                onChange={(e) => setSmartInput(e.target.value)}
                placeholder="e.g. 'Uber to the airport for $45' or 'Groceries at Woolworths R1200'"
                className="w-full rounded-xl pl-4 pr-12 py-4 bg-obsidian-900/80 border border-obsidian-600 text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors font-medium shadow-inner"
                disabled={isCategorizing}
              />
              <button 
                type="submit" 
                disabled={isCategorizing || !smartInput}
                className="absolute right-2 top-2 bottom-2 aspect-square rounded-lg bg-gold-gradient flex items-center justify-center text-obsidian-900 hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isCategorizing ? <Loader2 size={18} className="animate-spin" /> : <Activity size={18} />}
              </button>
            </form>

            <div className="hidden md:block w-px bg-obsidian-700"></div>

            <div 
              className="flex-1 rounded-xl border border-dashed border-obsidian-600 bg-obsidian-900/50 hover:bg-obsidian-800/80 hover:border-gold-500 transition-all cursor-pointer flex flex-col items-center justify-center p-4 relative"
              onClick={() => fileInputRef.current?.click()}
            >
              {isParsingReceipt ? (
                <div className="flex items-center gap-3 text-gold-500">
                  <Loader2 size={24} className="animate-spin" />
                  <span className="font-bold text-xs uppercase tracking-widest">Scanning Receipt...</span>
                </div>
              ) : (
                <>
                  <UploadCloud size={24} className="text-platinum-400 mb-2" />
                  <span className="font-bold text-[10px] uppercase tracking-widest text-platinum-400">Upload Receipt or Invoice</span>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,.pdf" 
                onChange={handleReceiptUpload} 
              />
            </div>
          </div>
        </div>
      )}

      {/* TOP ROW: SET BUDGET & ADD EXPENSE FORMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* MANUAL EXPENSE FORM */}
        <div className="glass-card p-6 sm:p-10 rounded-2xl relative border border-obsidian-700/50 shadow-2xl bg-obsidian-800/60">
          <h3 className="text-2xl font-serif text-white mb-8 tracking-wide border-b border-obsidian-700/50 pb-4">
            {editingId ? 'Modify Ledger Entry' : 'Manual Entry'}
          </h3>
          <form onSubmit={handleExpenseSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest text-platinum-400">Transaction Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-obsidian-900/50 border border-obsidian-600 text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors font-medium shadow-inner"
                  placeholder="e.g. Fine Dining"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest text-platinum-400">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-obsidian-900/50 border border-obsidian-600 text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors font-medium shadow-inner"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest text-platinum-400">Classification</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-obsidian-900/50 border border-obsidian-600 text-white focus:outline-none focus:border-gold-500 transition-colors font-medium appearance-none shadow-inner cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c} className="bg-obsidian-900">{c}</option>)}
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-5 h-5 rounded bg-obsidian-900 border-obsidian-600 text-gold-500 focus:ring-gold-500 transition-colors cursor-pointer accent-gold-500"
              />
              <label htmlFor="isRecurring" className="text-xs font-bold uppercase tracking-widest cursor-pointer text-platinum-400 hover:text-gold-400 transition-colors">
                Recurring Monthly Outflow
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gold-gradient hover:opacity-90 text-obsidian-900 font-bold text-xs uppercase tracking-widest py-4 px-4 rounded-xl transition duration-300 shadow-[0_10px_20px_rgba(212,175,55,0.2)] shimmer-effect"
              >
                {editingId ? 'Save Revisions' : 'Record Entry'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setName(''); setAmount(''); setIsRecurring(false); }}
                  className="flex-1 font-bold text-xs uppercase tracking-widest py-4 px-4 rounded-xl transition duration-300 border border-obsidian-600 bg-obsidian-900/50 text-platinum-300 hover:bg-obsidian-800 hover:text-white shadow-inner"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* SET BUDGET FORM */}
        <div className="glass-card p-6 sm:p-10 rounded-2xl relative border-gold-gradient">
          <h3 className="text-2xl font-serif text-white mb-4 tracking-wide border-b border-obsidian-700/50 pb-4">Establish Allocation</h3>
          <p className="text-xs font-medium mb-8 text-platinum-500 leading-relaxed">Define precise monthly ceilings for your expenditure categories to maintain wealth trajectories.</p>
          
          <form onSubmit={handleBudgetSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest text-platinum-400">Category</label>
              <select
                value={budgetCategory}
                onChange={(e) => setBudgetCategory(e.target.value)}
                className="w-full rounded-xl px-4 py-3 bg-obsidian-900/50 border border-obsidian-600 text-white focus:outline-none focus:border-gold-500 transition-colors font-medium appearance-none shadow-inner cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c} className="bg-obsidian-900">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest flex justify-between text-platinum-400">
                <span>Allocated Limit</span>
                {categoryBudgets[budgetCategory] && (
                  <span className="text-gold-500">Current: {formatCurrency(categoryBudgets[budgetCategory])}</span>
                )}
              </label>
              <input
                type="number"
                step="0.01"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="w-full rounded-xl px-4 py-3 bg-obsidian-900/50 border border-obsidian-600 text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors font-medium shadow-inner"
                required
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-obsidian-900 font-bold text-xs uppercase tracking-widest py-4 px-4 rounded-xl transition duration-300 shadow-[0_5px_15px_rgba(212,175,55,0.1)]"
              >
                Enforce Allocation
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* EXPENSE LIST & FILTERS */}
      <div className="glass-card p-6 sm:p-10 rounded-2xl relative border-gold-gradient">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-obsidian-700/50 pb-6">
          <h3 className="text-2xl font-serif text-white tracking-wide">Master Ledger</h3>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <input
              type="text"
              placeholder="Search Ledger..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 rounded-xl px-4 py-2.5 bg-obsidian-900/50 border border-obsidian-600 text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors font-medium text-sm shadow-inner"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full sm:w-48 rounded-xl px-4 py-2.5 bg-obsidian-900/50 border border-obsidian-600 text-white focus:outline-none focus:border-gold-500 transition-colors font-medium text-sm appearance-none shadow-inner cursor-pointer"
            >
              <option value="All" className="bg-obsidian-900">All Classifications</option>
              {categories.map(c => <option key={c} value={c} className="bg-obsidian-900">{c}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-40 rounded-xl px-4 py-2.5 bg-obsidian-900/50 border border-obsidian-600 text-white focus:outline-none focus:border-gold-500 transition-colors font-medium text-sm appearance-none shadow-inner cursor-pointer"
            >
              <option value="date_desc" className="bg-obsidian-900">Latest First</option>
              <option value="amount_desc" className="bg-obsidian-900">Highest Value</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredExpenses.map((exp) => {
            let Icon = Activity;

            if (exp.category === 'Home' || exp.category === 'Housing & Rent') { Icon = Home; }
            else if (exp.category === 'Groceries') { Icon = ShoppingCart; }
            else if (exp.category === 'Utilities') { Icon = Zap; }
            else if (exp.category === 'Entertainment') { Icon = Film; }
            else if (exp.category === 'Transportation') { Icon = Coffee; }

            return (
              <div key={exp.id || exp._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl bg-obsidian-900/40 border border-obsidian-700 hover:border-gold-500/30 transition-all hover:bg-obsidian-800/60 group">
                <div className="flex items-center gap-5 mb-4 sm:mb-0">
                  <div className="p-3 rounded-xl bg-obsidian-900 text-platinum-400 group-hover:text-gold-500 border border-obsidian-700 shadow-inner transition-colors">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-base text-platinum-200 group-hover:text-white transition-colors">{exp.name}</p>
                      {exp.isRecurring && <span className="text-[9px] font-bold uppercase tracking-widest bg-gold-500/10 text-gold-500 border border-gold-500/20 px-2 py-0.5 rounded-sm">Recurring</span>}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-platinum-500">
                      {exp.category} &bull; {new Date(exp.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 border-t sm:border-0 pt-4 sm:pt-0 border-obsidian-700">
                  <span className="font-serif text-xl text-white">
                    {formatCurrency(exp.amount)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(exp)} className="p-2 rounded-lg transition-colors text-platinum-500 hover:bg-obsidian-700 hover:text-gold-400">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDeleteExpense(exp.id || exp._id)} className="p-2 rounded-lg transition-colors text-platinum-500 hover:bg-red-500/20 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredExpenses.length === 0 && (
            <div className="text-center py-16 border border-dashed border-obsidian-700 rounded-2xl bg-obsidian-900/30">
              <Activity size={40} className="mx-auto mb-4 opacity-20 text-gold-500" />
              <p className="font-serif italic text-platinum-500 text-lg">No entries match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesTab;
