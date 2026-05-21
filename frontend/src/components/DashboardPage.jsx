import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { loadUserData, saveUserData } from '../utils/dataStore';
import { LogOut, Diamond } from 'lucide-react';
import budgetEaseLogo from '../assets/budgetease logo.png';

// Components
import MetricCards from './MetricCards';
import OverviewTab from './OverviewTab';
import ExpensesTab from './ExpensesTab';
import IncomeTab from './IncomeTab';
import GoalsTab from './GoalsTab';
import SavingTipsTab from './SavingTipsTab';
import ProfileTab from './ProfileTab';
import CurrencyConverter from './CurrencyConverter';
import ThemeToggle from './ThemeToggle';

const DashboardPage = ({ onNavigate, onLogout, selectedCurrency, setSelectedCurrency, CURRENCIES, theme, toggleTheme }) => {
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
  const budgetedExpenses = expenses.filter(e => categoryBudgets[e.category] > 0).reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = totalBudgetedAmount - budgetedExpenses;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gold-500 font-serif animate-pulse">Loading Your Portfolio...</div>;

  return (
    <div className="min-h-screen font-sans bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
      <div className="min-h-screen bg-obsidian-900/90 backdrop-blur-md">
        
        {/* HEADER NAV */}
        <nav className="border-b border-obsidian-700/50 sticky top-0 z-50 shadow-2xl bg-obsidian-900/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
                <span className="font-serif text-2xl font-bold text-obsidian-900">B</span>
              </div>
              <span className="text-2xl font-serif text-white tracking-wider">BudgetEase</span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <div className="hidden sm:flex items-center gap-2 rounded-xl p-1 bg-obsidian-800/50 border border-obsidian-700">
                <Diamond size={14} className="text-gold-500 ml-2" />
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-transparent text-sm font-bold focus:outline-none pr-2 appearance-none cursor-pointer text-platinum-300 hover:text-gold-400 transition-colors"
                >
                  {CURRENCIES.map(code => <option key={code} value={code} className="bg-obsidian-900 text-platinum-200">{code}</option>)}
                </select>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all text-platinum-400 hover:text-gold-400 hover:bg-obsidian-800"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          
          {/* Ambient background glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          {/* WELCOME HEADER */}
          <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
            <div>
              <p className="text-gold-500 font-bold tracking-widest uppercase text-xs mb-2">Private Wealth Overview</p>
              <h1 className="text-4xl sm:text-5xl font-serif mb-2 tracking-wide text-white">
                Welcome back, <span className="text-gold-gradient">{currentUser?.user_metadata?.username || 'Client'}</span>.
              </h1>
              <p className="font-medium text-platinum-400">Here is the current state of your financial portfolio.</p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-2xl bg-obsidian-800/80 border border-obsidian-700/50 p-1 backdrop-blur-md">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="flex-1 md:w-36 px-4 py-2.5 font-bold rounded-xl bg-transparent text-platinum-200 focus:outline-none appearance-none cursor-pointer hover:text-gold-400 transition-colors"
              >
                {months.map((m, i) => <option key={m} value={i} className="bg-obsidian-900">{m}</option>)}
              </select>
              <div className="w-px bg-obsidian-700 my-2"></div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="flex-1 md:w-28 px-4 py-2.5 font-bold rounded-xl bg-transparent text-platinum-200 focus:outline-none appearance-none cursor-pointer hover:text-gold-400 transition-colors"
              >
                {years.map(y => <option key={y} value={y} className="bg-obsidian-900">{y}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-medium shadow-lg backdrop-blur-sm">
              Error: {error}
            </div>
          )}

          {/* METRICS GRID */}
          <div className="relative z-10">
            <MetricCards 
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              netSavings={netSavings}
              remainingBudget={remainingBudget}
              selectedCurrency={selectedCurrency}
            />
          </div>

          {/* TABS NAVIGATION */}
          <div className="flex space-x-6 md:space-x-10 border-b border-obsidian-700/50 mb-10 overflow-x-auto scrollbar-hide relative z-10">
            {['dashboard', 'expenses', 'income', 'goals', 'tips', 'currency', 'profile'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap relative
                  ${activeTab === tab
                    ? 'text-gold-400'
                    : 'text-platinum-500 hover:text-platinum-300'}`}
              >
                {tab === 'tips' ? 'Advisor' : tab === 'dashboard' ? 'Portfolio' : tab === 'currency' ? 'Exchange' : tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-gradient shadow-[0_-2px_10px_rgba(212,175,55,0.5)]"></div>
                )}
              </button>
            ))}
          </div>

          {/* ACTIVE TAB CONTENT */}
          <div className="relative z-10">
            {activeTab === 'dashboard' && (
              <OverviewTab 
                expenses={expenses} 
                categoryBudgets={categoryBudgets} 
                selectedCurrency={selectedCurrency} 
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
              />
            )}

            {activeTab === 'goals' && (
              <GoalsTab 
                goals={goals}
                onAddGoal={handleAddGoal}
                onRemoveGoal={handleRemoveGoal}
                totalSavings={netSavings}
                selectedCurrency={selectedCurrency}
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
              />
            )}

            {activeTab === 'currency' && (
              <div className="max-w-3xl mx-auto animate-fadeIn">
                <CurrencyConverter />
              </div>
            )}

            {activeTab === 'profile' && (
              <ProfileTab 
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                CURRENCIES={CURRENCIES}
              />
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
