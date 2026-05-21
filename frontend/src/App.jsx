import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabase';

// Pages
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'ZAR', 'JPY', 'AUD', 'CAD'];

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');
  const [theme, setTheme] = useState('dark');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Initialize theme and auth
  useEffect(() => {
    // 1. Setup Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    // 2. Setup Auth & Listeners
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
        if (session.user?.user_metadata?.currency) {
          setSelectedCurrency(session.user.user_metadata.currency);
        }
      }
      setLoadingAuth(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
        if (session.user?.user_metadata?.currency) {
          setSelectedCurrency(session.user.user_metadata.currency);
        }
      } else {
        setIsAuthenticated(false);
        setCurrentPage('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (loadingAuth) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-bold text-xl ${theme === 'dark' ? 'bg-slate-950 text-emerald-500' : 'bg-gray-50 text-emerald-600'}`}>
        <div className="animate-pulse">Loading BudgetEase...</div>
      </div>
    );
  }

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage 
          onAuthSuccess={() => setCurrentPage('dashboard')} 
          onNavigate={setCurrentPage} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
      
      {currentPage === 'register' && (
        <RegisterPage 
          onAuthSuccess={() => setCurrentPage('dashboard')} 
          onNavigate={setCurrentPage} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
      
      {currentPage === 'dashboard' && isAuthenticated && (
        <DashboardPage 
          onNavigate={setCurrentPage}
          onLogout={() => {
            setIsAuthenticated(false);
            setCurrentPage('login');
          }}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          CURRENCIES={CURRENCIES}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
    </>
  );
};

export default App;
