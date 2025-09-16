// Dashboard Component
const DashboardPage = ({ onNavigate, selectedCurrency, setSelectedCurrency }) => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- NEW STATE for Financial Tracking ---
  const [income, setIncome] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState(JSON.parse(localStorage.getItem('categoryBudgets')) || {});
  const [goals, setGoals] = useState(JSON.parse(localStorage.getItem('goals')) || []);
  const [theme, setTheme] = useState('light'); // New state for theme
  const categories = ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Other'];

  const token = localStorage.getItem('token');
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filterCategory !== 'All') queryParams.append('category', filterCategory);
      if (sortBy) queryParams.append('sort', sortBy);
      if (searchQuery) queryParams.append('search', searchQuery);

      const response = await fetch(`${API_URL}/expenses?${queryParams.toString()}`, {
        headers: { 'x-auth-token': token },
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        onNavigate('login');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      } else {
        throw new Error('Failed to fetch expenses');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token, filterCategory, sortBy, searchQuery]);

  const handleAddExpense = async (newExpense) => {
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(newExpense),
      });
      if (response.ok) {
        fetchExpenses();
      } else {
        throw new Error('Failed to add expense');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${updatedExpense._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(updatedExpense),
      });
      if (response.ok) {
        fetchExpenses();
      } else {
        throw new Error('Failed to update expense');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (response.ok) {
        fetchExpenses();
      } else {
        throw new Error('Failed to delete expense');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  // FIX: This function was missing the navigation call.
  const handleLogout = () => {
    localStorage.removeItem('token');
    onNavigate('login');
  };

  // --- NEW FUNCTIONS for Financial Tracking ---
  const handleSetBudget = (category, amount) => {
    const newBudgets = { ...categoryBudgets, [category]: amount };
    setCategoryBudgets(newBudgets);
    localStorage.setItem('categoryBudgets', JSON.stringify(newBudgets));
  };
  
  const handleAddIncome = (newIncome) => {
    const newIncomeList = [...income, newIncome];
    setIncome(newIncomeList);
    // For simplicity, we won't persist income yet, but a future backend would.
  };

  const handleAddGoal = (newGoal) => {
    const newGoals = [...goals, newGoal];
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
  };

  const handleRemoveGoal = (goalId) => {
    const newGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(newGoals);
    localStorage.setItem('goals', JSON.stringify(newGoals));
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  const netSavings = totalIncome - totalExpenses;

  if (loading) return <div className="text-center text-lg mt-8">Loading...</div>;
  if (error) return <div className="text-center text-lg text-red-500 mt-8">Error: {error}</div>;

  return (
    <div className={`flex flex-col items-center min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} p-4`}>
      <div className="w-full max-w-4xl">
        <LogoHeader />
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Welcome to your Dashboard
            </h2>
            <div className="flex items-center space-x-4">
              <label htmlFor="currency-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Currency:
              </label>
              <select
                id="currency-select"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
                {CURRENCIES.map(code => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This is where you'll manage your budget, track expenses, and view your financial insights.
          </p>
          
          {/* --- UPDATED FINANCIAL OVERVIEW --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-green-800 dark:text-green-200 mb-2">Total Income</h3>
              <p className="text-2xl font-extrabold text-green-900 dark:text-green-100">{formatCurrency(totalIncome, selectedCurrency)}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">Total Expenses</h3>
              <p className="text-2xl font-extrabold text-red-900 dark:text-red-100">{formatCurrency(totalExpenses, selectedCurrency)}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">Net Cash Flow</h3>
              <p className="text-2xl font-extrabold text-blue-900 dark:text-blue-100">{formatCurrency(netSavings, selectedCurrency)}</p>
            </div>
             <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200 mb-2">Remaining Budget</h3>
              <p className="text-2xl font-extrabold text-purple-900 dark:text-purple-100">N/A</p>
            </div>
          </div>

          {/* --- NEW SECTION: Category Budgets Progress --- */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Budget Progress by Category</h3>
            <div className="space-y-4">
              {categories.map(cat => {
                const totalSpent = expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0);
                const budgetAmount = categoryBudgets[cat] || 0;
                const progressPercentage = budgetAmount > 0 ? (totalSpent / budgetAmount) * 100 : 0;
                const progressColor = progressPercentage > 100 ? 'bg-red-500' : 'bg-blue-500';

                return (
                  <div key={cat}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{cat}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(totalSpent, selectedCurrency)} / {formatCurrency(budgetAmount, selectedCurrency)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                      <div
                        className={`${progressColor} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(100, progressPercentage)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <BudgetForm categories={categories} categoryBudgets={categoryBudgets} onSetBudget={handleSetBudget} selectedCurrency={selectedCurrency} />
          <IncomeForm onAddIncome={handleAddIncome} />
          <ExpenseForm 
            onAddExpense={handleAddExpense} 
            onUpdateExpense={handleUpdateExpense}
            editingExpense={editingExpense}
            onCancelEdit={handleCancelEdit}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <SpendingChart expenses={expenses} selectedCurrency={selectedCurrency} />
            <FinancialGoals goals={goals} onAddGoal={handleAddGoal} onRemoveGoal={handleRemoveGoal} totalSavings={netSavings} selectedCurrency={selectedCurrency} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
[O              <input
                type="text"
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-1/3 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full md:w-1/3 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="w-full md:w-1/3 flex justify-end gap-2">
                <button
                  onClick={() => setSortBy('amount_desc')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${sortBy === 'amount_desc' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                >
                  Sort by Amount
                </button>
                <button
                  onClick={() => setSortBy('date_desc')}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${sortBy === 'date_desc' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                >
                  Sort by Date
                </button>
              </div>
            </div>
          </div>

          <ExpenseList 
            expenses={expenses} 
            onEdit={handleEditExpense} 
            onDelete={handleDeleteExpense} 
            selectedCurrency={selectedCurrency}
          />
        </div>
      </div>
    </div>
  );
};
