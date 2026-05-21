import React, { useState } from 'react';
import { Target, Trash2, Plus, TrendingUp, Award, Rocket } from 'lucide-react';

const GoalsTab = ({ goals, onAddGoal, onRemoveGoal, totalSavings, selectedCurrency, theme }) => {
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
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      
      <div className={`p-6 sm:p-8 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add Savings Goal</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <div className="md:col-span-2">
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Goal Name</label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              placeholder="e.g. New Car Downpayment"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>Target Amount</label>
            <input
              type="number"
              step="0.01"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              required
            />
          </div>
          <div className="md:col-span-1 pt-2 md:pt-7">
            <button
              type="submit"
              className="w-full h-[50px] bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition duration-300 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              <span className="md:hidden">Add Goal</span>
            </button>
          </div>
        </form>
      </div>

      <div className={`p-6 sm:p-8 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200 dark:border-slate-700">
          <h3 className={`text-xl font-bold flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Target className="text-indigo-500" />
            Active Goals
          </h3>
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${theme === 'dark' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
            Available Net Savings: {formatCurrency(totalSavings)}
          </div>
        </div>

        <div className="space-y-6">
          {goals.map((goal, i) => {
            const progress = Math.min(totalSavings, goal.target);
            const progressPercentage = (progress / goal.target) * 100;
            const isCompleted = progressPercentage >= 100;

            const Icon = isCompleted ? Award : Rocket;
            const colorClass = isCompleted ? 'text-emerald-500' : 'text-indigo-500';
            const bgClass = isCompleted ? 'bg-emerald-500/10' : 'bg-indigo-500/10';
            const barClass = isCompleted ? 'bg-emerald-500' : 'bg-indigo-500';

            return (
              <div key={goal.id} className={`relative overflow-hidden p-6 rounded-xl border transition-all hover:shadow-md ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
                {isCompleted && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                )}
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{goal.name}</h4>
                      <p className={`text-sm font-medium mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                        {formatCurrency(progress)} saved of {formatCurrency(goal.target)}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveGoal(goal.id)} 
                    className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/20' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Progress</span>
                    <span className={colorClass}>{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className={`w-full rounded-full h-3 overflow-hidden border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-200 border-gray-300'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${barClass}`}
                      style={{ width: `${Math.min(100, progressPercentage)}%` }}
                    >
                      <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <p className="mt-4 text-sm font-bold text-emerald-500 flex items-center gap-2">
                      <Award size={16} />
                      Goal Accomplished!
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {goals.length === 0 && (
            <div className={`text-center py-12 border-2 border-dashed rounded-xl ${theme === 'dark' ? 'border-slate-700 text-slate-500' : 'border-gray-200 text-gray-500'}`}>
              <Target size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-medium">No savings goals yet. Start dreaming big!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsTab;
