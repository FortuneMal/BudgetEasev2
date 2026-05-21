import React, { useState } from 'react';
import { supabase } from '../utils/supabase';
import ThemeToggle from './ThemeToggle';
import budgetEaseLogo from '../assets/budgetease logo.png';

const RegisterPage = ({ onAuthSuccess, onNavigate, theme, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: sbError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          currency: 'USD',
        }
      }
    });

    if (sbError) {
      setError(sbError.message);
    } else {
      localStorage.setItem('token', data.session.access_token);
      onAuthSuccess();
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans selection:bg-emerald-500/30 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full max-w-md relative animate-fadeIn">

        <div className="fixed top-8 right-8 z-50">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        <div className="flex flex-col items-center mb-10">
          <img src={budgetEaseLogo} alt="BudgetEase" className="h-24 sm:h-32 w-auto mb-6 drop-shadow-2xl hover:scale-105 transition-transform" />
          <h1 className="text-3xl font-extrabold font-['Outfit'] mb-2 tracking-tight">Create Account</h1>
          <p className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Join BudgetEase to start saving today.</p>
        </div>

        <div className={`rounded-3xl p-8 sm:p-10 border shadow-2xl backdrop-blur-md ${theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-gray-200'}`}>
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-semibold p-4 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className={`block text-sm font-bold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`} htmlFor="username">
                Display Name
              </label>
              <input
                className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors font-medium ${theme === 'dark'
                  ? 'bg-slate-950/50 border-slate-700 text-white placeholder-slate-600 focus:bg-slate-950'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'
                  }`}
                id="username"
                type="text"
                placeholder="How should we call you?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`} htmlFor="email">
                Email Address
              </label>
              <input
                className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors font-medium ${theme === 'dark'
                  ? 'bg-slate-950/50 border-slate-700 text-white placeholder-slate-600 focus:bg-slate-950'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'
                  }`}
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`} htmlFor="password">
                Password
              </label>
              <input
                className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors font-medium tracking-widest ${theme === 'dark'
                  ? 'bg-slate-950/50 border-slate-700 text-white placeholder-slate-600 focus:bg-slate-950'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'
                  }`}
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-lg py-4 px-4 rounded-xl transition duration-300 shadow-xl shadow-emerald-500/20 flex justify-center items-center mt-4"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-slate-800">
            <p className={`font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
