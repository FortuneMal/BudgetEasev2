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
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Handle Theme Toggle
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    // Setup Auth & Listeners
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

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-xl bg-obsidian-900 text-gold-500">
        <div className="animate-pulse">Loading Premium Experience...</div>
      </div>
    );
  }

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage 
          onAuthSuccess={() => setCurrentPage('dashboard')} 
          onNavigate={setCurrentPage} 
        />
      )}
      
      {currentPage === 'register' && (
        <RegisterPage 
          onAuthSuccess={() => setCurrentPage('dashboard')} 
          onNavigate={setCurrentPage} 
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
