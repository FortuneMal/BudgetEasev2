import React, { useState } from 'react';
import { Target, Trash2, Plus, TrendingUp, Award, Rocket } from 'lucide-react';

const GoalsTab = ({ goals, onAddGoal, onRemoveGoal, totalSavings, selectedCurrency }) => {
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');

  const formatCurrency = (val) => new Intl.NumberFormat(navigator.language, { style: 'currency', currency: selectedCurrency }).format(val);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (goalName && goalAmount) {
      const newGoal = {
        id: Date.now(),
        name: goalName,
        target: parseFloat(goalAmount),
        progress: 0,
      };
      onAddGoal(newGoal);
      setGoalName('');
      setGoalAmount('');
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-4xl mx-auto relative z-10">
      
      <div className="glass-card p-6 sm:p-10 rounded-2xl relative border-gold-gradient">
        <h3 className="text-2xl font-serif text-white mb-8 tracking-wide border-b border-obsidian-700/50 pb-4">Define Financial Objective</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest text-platinum-400">Objective Name</label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-obsidian-900/50 border border-obsidian-600 text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors font-medium shadow-inner"
              placeholder="e.g. Asset Acquisition"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest text-platinum-400">Target Capital</label>
            <input
              type="number"
              step="0.01"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              className="w-full rounded-xl px-4 py-3 bg-obsidian-900/50 border border-obsidian-600 text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors font-medium shadow-inner"
              required
            />
          </div>
          <div className="md:col-span-1 pt-2 md:pt-6">
            <button
              type="submit"
              className="w-full h-[52px] bg-gold-gradient hover:opacity-90 text-obsidian-900 font-bold text-xs uppercase tracking-widest rounded-xl transition duration-300 shadow-[0_10px_20px_rgba(212,175,55,0.2)] flex items-center justify-center gap-2 shimmer-effect"
            >
              <Plus size={16} />
              <span className="md:hidden">Add Objective</span>
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card p-6 sm:p-10 rounded-2xl relative border-gold-gradient">
        <div className="flex justify-between items-center mb-8 border-b border-obsidian-700/50 pb-6">
          <h3 className="text-2xl font-serif text-white tracking-wide flex items-center gap-3">
            <Target className="text-gold-500" />
            Active Objectives
          </h3>
          <div className="px-5 py-2 rounded-xl bg-obsidian-900 border border-obsidian-700 shadow-inner">
            <span className="text-[10px] uppercase tracking-widest text-platinum-400 font-bold block mb-1">Available Capital</span>
            <span className="text-gold-500 font-serif text-xl">{formatCurrency(totalSavings)}</span>
          </div>
        </div>

        <div className="space-y-6">
          {goals.map((goal, i) => {
            const progress = Math.min(totalSavings, goal.target);
            const progressPercentage = (progress / goal.target) * 100;
            const isCompleted = progressPercentage >= 100;

            const Icon = isCompleted ? Award : Rocket;

            return (
              <div key={goal.id} className="relative overflow-hidden p-6 rounded-2xl bg-obsidian-900/40 border border-obsidian-700 hover:border-gold-500/30 transition-all hover:bg-obsidian-800/60 group shadow-inner">
                {isCompleted && (
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                )}
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="p-3 rounded-xl bg-obsidian-900 text-gold-500 border border-obsidian-700 shadow-inner group-hover:border-gold-500/50 transition-colors">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-platinum-200 group-hover:text-white transition-colors">{goal.name}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-platinum-500">
                        {formatCurrency(progress)} secured of {formatCurrency(goal.target)}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveGoal(goal.id)} 
                    className="p-2 rounded-lg transition-colors text-platinum-500 hover:text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
                    <span className="text-platinum-400">Acquisition Progress</span>
                    <span className="text-gold-500">{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-obsidian-900 rounded-full overflow-hidden shadow-inner border border-obsidian-800">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${isCompleted ? 'bg-gold-400' : 'bg-gold-gradient'}`}
                      style={{ width: `${Math.min(100, progressPercentage)}%` }}
                    >
                      <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gold-400 flex items-center gap-2">
                      <Award size={14} />
                      Objective Successfully Acquired
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {goals.length === 0 && (
            <div className="text-center py-16 border border-dashed border-obsidian-700 rounded-2xl bg-obsidian-900/30">
              <Target size={40} className="mx-auto mb-4 opacity-20 text-gold-500" />
              <p className="font-serif italic text-platinum-500 text-lg">No objectives defined. Set your first financial target.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsTab;
