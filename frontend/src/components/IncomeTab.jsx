import React, { useState } from 'react';
import { TrendingUp, Trash2, Plus, Briefcase, Award, Heart, Gift, MoreHorizontal } from 'lucide-react';

const IncomeTab = ({ income, onAddIncome, onRemoveIncome, selectedMonth, selectedYear, selectedCurrency }) => {
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
    <div className="space-y-10 animate-fadeIn max-w-4xl mx-auto relative z-10">
      
      <div className="glass-card p-6 sm:p-10 rounded-2xl relative border-gold-gradient">
        <h3 className="text-2xl font-serif text-white mb-8 tracking-wide border-b border-obsidian-700/50 pb-4">Record Inflow</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest text-platinum-400">Origin / Entity</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-obsidian-900/50 border border-obsidian-600 text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors font-medium shadow-inner"
              placeholder="e.g. Capital Gains"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest text-platinum-400">Value</label>
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
              {incomeCategories.map(cat => <option key={cat} value={cat} className="bg-obsidian-900">{cat}</option>)}
            </select>
          </div>
          <div className="md:col-span-3 pt-4">
            <button
              type="submit"
              className="w-full bg-gold-gradient hover:opacity-90 text-obsidian-900 font-bold text-xs uppercase tracking-widest py-4 px-4 rounded-xl transition duration-300 shadow-[0_10px_20px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3 shimmer-effect"
            >
              <Plus size={16} />
              Register Capital
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card p-6 sm:p-10 rounded-2xl relative border-gold-gradient">
        <div className="flex justify-between items-center mb-8 border-b border-obsidian-700/50 pb-6">
          <h3 className="text-2xl font-serif text-white tracking-wide">
            Capital Inflow ({months[selectedMonth]} {selectedYear})
          </h3>
          <span className="text-3xl font-serif text-gold-500 drop-shadow-md">
            {formatCurrency(totalFilteredIncome)}
          </span>
        </div>

        <div className="space-y-4">
          {filteredIncome.map((inc, i) => {
            let Icon = Briefcase;

            if (inc.category === 'Freelance') { Icon = TrendingUp; }
            else if (inc.category === 'Investment') { Icon = Award; }
            else if (inc.category === 'Gift') { Icon = Gift; }
            else if (inc.category === 'Other') { Icon = MoreHorizontal; }

            const originalIndex = income.indexOf(inc);

            return (
              <div key={i} className="flex justify-between items-center p-5 rounded-xl bg-obsidian-900/40 border border-obsidian-700 hover:border-gold-500/30 transition-all hover:bg-obsidian-800/60 group">
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-xl bg-obsidian-900 text-platinum-400 group-hover:text-gold-500 border border-obsidian-700 shadow-inner transition-colors">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-base text-platinum-200 group-hover:text-white transition-colors">{inc.source}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-platinum-500">
                      {inc.category} &bull; {new Date(inc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-serif text-xl text-white">
                    +{formatCurrency(inc.amount)}
                  </span>
                  <button
                    onClick={() => onRemoveIncome(originalIndex)}
                    className="p-2 rounded-lg transition-colors text-platinum-500 hover:bg-red-500/20 hover:text-red-400"
                    title="Remove capital"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}

          {filteredIncome.length === 0 && (
            <div className="text-center py-16 border border-dashed border-obsidian-700 rounded-2xl bg-obsidian-900/30">
              <Briefcase size={40} className="mx-auto mb-4 opacity-20 text-gold-500" />
              <p className="font-serif italic text-platinum-500 text-lg">No capital inflow registered for this period.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeTab;
