import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

const RegisterPage = ({ onAuthSuccess, onNavigate }) => {
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
    <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-obsidian-900/90 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-md relative z-10 animate-fadeIn pt-10 pb-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(212,175,55,0.3)] animate-float">
            <span className="font-serif text-3xl font-bold text-obsidian-900">B</span>
          </div>
          <h1 className="text-3xl font-serif text-white mb-2 tracking-wide">Join BudgetEase</h1>
          <p className="font-sans text-platinum-400 tracking-widest uppercase text-[10px]">Exclusive Wealth Management</p>
        </div>

        <div className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden border-gold-gradient">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl"></div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium p-4 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5 relative z-10">
            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest text-platinum-400" htmlFor="username">
                Preferred Name
              </label>
              <input
                className="w-full px-4 py-3.5 rounded-xl bg-obsidian-900/50 border border-obsidian-600 text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors font-medium shadow-inner"
                id="username"
                type="text"
                placeholder="How should we address you?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest text-platinum-400" htmlFor="email">
                Email Address
              </label>
              <input
                className="w-full px-4 py-3.5 rounded-xl bg-obsidian-900/50 border border-obsidian-600 text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors font-medium shadow-inner"
                id="email"
                type="email"
                placeholder="client@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold mb-2 uppercase tracking-widest text-platinum-400" htmlFor="password">
                Secure Password
              </label>
              <input
                className="w-full px-4 py-3.5 rounded-xl bg-obsidian-900/50 border border-obsidian-600 text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors font-medium tracking-widest shadow-inner"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="w-full bg-gold-gradient hover:opacity-90 text-obsidian-900 font-bold text-sm uppercase tracking-widest py-4 px-4 rounded-xl transition duration-300 shadow-[0_10px_20px_rgba(212,175,55,0.2)] flex justify-center items-center mt-4 shimmer-effect"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-obsidian-900" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Submit Application'}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-obsidian-700 relative z-10">
            <p className="font-medium text-sm text-platinum-500">
              Existing client?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="font-bold text-gold-500 hover:text-gold-400 transition-colors"
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
