import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { loadUserData, saveUserData } from '../utils/dataStore';
import { LogOut } from 'lucide-react';
import budgetEaseLogo from '../assets/budgetease logo.png';

// Components
import ThemeToggle from './ThemeToggle';
import MetricCards from './MetricCards';
import OverviewTab from './OverviewTab';
import ExpensesTab from './ExpensesTab';
import IncomeTab from './IncomeTab';
import GoalsTab from './GoalsTab';
import SavingTipsTab from './SavingTipsTab';
import ProfileTab from './ProfileTab';
import CurrencyConverter from './CurrencyConverter';

const DashboardPage = ({ onNavigate, onLogout, selectedCurrency, setSelectedCurrency, theme, toggleTheme, CURRENCIES }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core Data State
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [goals, setGoals] = useState([]);

  // Time Selection
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  useEffect(() => {
    const initDashboard = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) {
        onLogout();
        return;
      }
      setCurrentUser(user);

      if (user.user_metadata?.currency) {
        setSelectedCurrency(user.user_metadata.currency);
      }

      // Load Scoped Local Data
      const loadedIncome = await loadUserData(user.id, 'income', []);
      const loadedBudgets = await loadUserData(user.id, 'categoryBudgets', {});
      const loadedGoals = await loadUserData(user.id, 'goals', []);
      
      setIncome(loadedIncome);
      setCategoryBudgets(loadedBudgets);
      setGoals(loadedGoals);

      // Load Expenses from Supabase
      await fetchExpenses(user.id);
    };

    initDashboard();
  }, []);

  const fetchExpenses = async (userId) => {
    try {
      const { data, error: sbError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (sbError) throw new Error(sbError.message);

      // Filter by Month and Year + Recurring logic
      const filteredByDate = data.filter(e => {
        const d = new Date(e.created_at || Date.now());
        const matchesMonth = d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        const isRecurringCarryOver = e.isRecurring && (
          d.getFullYear() < selectedYear ||
          (d.getFullYear() === selectedYear && d.getMonth() <= selectedMonth)
        );
        return matchesMonth || isRecurringCarryOver;
      });

      setExpenses(filteredByDate);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchExpenses(currentUser.id);
    }
  }, [selectedMonth, selectedYear]);

  // Handlers for Data Mutations
  const handleAddExpense = async (newExpense) => {
    try {
      const { error: sbError } = await supabase.from('expenses').insert([{ ...newExpense, user_id: currentUser.id }]);
      if (sbError) throw new Error(sbError.message);
      fetchExpenses(currentUser.id);
    } catch (err) { setError(err.message); }
  };

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      const { error: sbError } = await supabase.from('expenses')
        .update({ name: updatedExpense.name, amount: updatedExpense.amount, category: updatedExpense.category, isRecurring: updatedExpense.isRecurring })
        .eq('id', updatedExpense.id);
      if (sbError) throw new Error(sbError.message);
      fetchExpenses(currentUser.id);
    } catch (err) { setError(err.message); }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const { error: sbError } = await supabase.from('expenses').delete().eq('id', id);
      if (sbError) throw new Error(sbError.message);
      fetchExpenses(currentUser.id);
    } catch (err) { setError(err.message); }
  };

  const handleSetBudget = (category, amount) => {
    const newBudgets = { ...categoryBudgets, [category]: amount };
    setCategoryBudgets(newBudgets);
    saveUserData(currentUser.id, 'categoryBudgets', newBudgets);
  };

  const handleAddIncome = (newIncome) => {
    const newIncomeList = [...income, newIncome];
    setIncome(newIncomeList);
    saveUserData(currentUser.id, 'income', newIncomeList);
  };

  const handleRemoveIncome = (index) => {
    const newIncomeList = income.filter((_, i) => i !== index);
    setIncome(newIncomeList);
    saveUserData(currentUser.id, 'income', newIncomeList);
  };

  const handleAddGoal = (newGoal) => {
    const newGoals = [...goals, newGoal];
    setGoals(newGoals);
    saveUserData(currentUser.id, 'goals', newGoals);
  };

  const handleRemoveGoal = (goalId) => {
    const newGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(newGoals);
    saveUserData(currentUser.id, 'goals', newGoals);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    onNavigate('login');
  };

  // Calculations
  const filteredIncome = income.filter(inc => {
    const d = new Date(inc.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = filteredIncome.reduce((sum, inc) => sum + inc.amount, 0);
  const netSavings = totalIncome - totalExpenses;
  
  // Calculate Actual Remaining Budget
  const totalBudgetedAmount = Object.values(categoryBudgets).reduce((sum, amount) => sum + amount, 0);
  // Only count expenses that fall into budgeted categories towards the "Remaining Budget" calculation
  const budgetedExpenses = expenses.filter(e => categoryBudgets[e.category] > 0).reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = totalBudgetedAmount - budgetedExpenses;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-emerald-500 font-bold animate-pulse">Loading Your Dashboard...</div>;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 selection:bg-emerald-500/30 ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* HEADER NAV */}
      <nav className={`border-b sticky top-0 z-50 shadow-sm backdrop-blur-md ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <img src={budgetEaseLogo} alt="BudgetEase Logo" className="h-12 w-auto drop-shadow-md" />
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            <div className={`hidden sm:flex items-center gap-2 rounded-xl p-1 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'}`}>
              <span className={`text-xs pl-2 font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Cur</span>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className={`bg-transparent text-sm font-extrabold focus:outline-none pr-2 appearance-none cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                {CURRENCIES.map(code => <option key={code} value={code} className="text-gray-900">{code}</option>)}
              </select>
            </div>

            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all border border-transparent ${theme === 'dark'
                ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                }`}
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* WELCOME HEADER */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className={`text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-500">{currentUser?.user_metadata?.username || 'there'}</span>
            </h1>
            <p className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Here is what's happening with your finances this month.</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto shadow-sm">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className={`flex-1 md:w-36 px-4 py-2.5 font-bold rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors appearance-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300'}`}
            >
              {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className={`flex-1 md:w-28 px-4 py-2.5 font-bold rounded-xl border focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors appearance-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-300'}`}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl font-medium">
            Error: {error}
          </div>
        )}

        {/* METRICS GRID */}
        <MetricCards 
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          netSavings={netSavings}
          remainingBudget={remainingBudget}
          selectedCurrency={selectedCurrency}
          theme={theme}
        />

        {/* TABS NAVIGATION */}
        <div className={`flex space-x-2 md:space-x-8 border-b-2 mb-8 overflow-x-auto scrollbar-hide ${theme === 'dark' ? 'border-slate-800' : 'border-gray-200'}`}>
          {['dashboard', 'expenses', 'income', 'goals', 'tips', 'currency', 'profile'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-sm md:text-base font-bold uppercase tracking-wider transition-colors whitespace-nowrap
                ${activeTab === tab
                  ? 'border-b-4 border-emerald-500 text-emerald-500'
                  : `border-transparent ${theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-700'}`}`}
            >
              {tab === 'tips' ? 'AI Tips' : tab === 'dashboard' ? 'Overview' : tab === 'currency' ? 'Exchange Rates' : tab}
            </button>
          ))}
        </div>

        {/* ACTIVE TAB CONTENT */}
        {activeTab === 'dashboard' && (
          <OverviewTab 
            expenses={expenses} 
            categoryBudgets={categoryBudgets} 
            selectedCurrency={selectedCurrency} 
            theme={theme}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesTab 
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            categoryBudgets={categoryBudgets}
            onSetBudget={handleSetBudget}
            selectedCurrency={selectedCurrency}
            theme={theme}
          />
        )}

        {activeTab === 'income' && (
          <IncomeTab 
            income={income}
            onAddIncome={handleAddIncome}
            onRemoveIncome={handleRemoveIncome}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedCurrency={selectedCurrency}
            theme={theme}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsTab 
            goals={goals}
            onAddGoal={handleAddGoal}
            onRemoveGoal={handleRemoveGoal}
            totalSavings={netSavings}
            selectedCurrency={selectedCurrency}
            theme={theme}
          />
        )}

        {activeTab === 'tips' && (
          <SavingTipsTab 
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            goals={goals}
            categoryBudgets={categoryBudgets}
            selectedCurrency={selectedCurrency}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            theme={theme}
          />
        )}

        {activeTab === 'currency' && (
          <div className="max-w-2xl mx-auto animate-fadeIn">
            <CurrencyConverter theme={theme} />
          </div>
        )}

        {activeTab === 'profile' && (
          <ProfileTab 
            theme={theme}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            CURRENCIES={CURRENCIES}
          />
        )}

      </main>
    </div>
  );
};

export default DashboardPage;
