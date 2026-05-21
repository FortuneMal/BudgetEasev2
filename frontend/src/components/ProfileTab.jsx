import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { User, CheckCircle, AlertCircle, Shield, Settings, Crown } from 'lucide-react';

const ProfileTab = ({ selectedCurrency, setSelectedCurrency, CURRENCIES }) => {
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentCurrency, setCurrentCurrency] = useState('');
  const [newCurrency, setNewCurrency] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.username || '';
        const currency = user.user_metadata?.currency || 'USD';
        setCurrentUsername(name);
        setNewUsername(name);
        setCurrentCurrency(currency);
        setNewCurrency(currency);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const { error } = await supabase.auth.updateUser({
      data: { 
        username: newUsername,
        currency: newCurrency 
      }
    });

    if (error) {
      setStatus({ type: 'error', message: error.message });
    } else {
      setStatus({ type: 'success', message: 'Client profile updated successfully.' });
      setCurrentUsername(newUsername);
      setCurrentCurrency(newCurrency);
      setSelectedCurrency(newCurrency);
      setTimeout(() => setStatus({ type: '', message: '' }), 4000);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center animate-fadeIn py-10 relative z-10">
      <div className="glass-card rounded-3xl p-8 sm:p-12 max-w-xl w-full border-gold-gradient relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-6 mb-10 border-b border-obsidian-700/50 pb-6 relative z-10">
          <div className="p-4 bg-obsidian-900 border border-obsidian-700 rounded-2xl text-gold-500 shadow-inner">
            <Crown size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-white tracking-wide">Client Profile</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-platinum-500 mt-1">Manage Account Preferences</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-8 relative z-10">
          <div className="p-8 rounded-2xl bg-obsidian-900/40 border border-obsidian-700 shadow-inner">
            <label htmlFor="profile-username" className="flex items-center gap-3 text-[10px] font-bold mb-4 uppercase tracking-widest text-platinum-400">
              <Shield size={14} className="text-gold-500" />
              Client Name
            </label>
            <input
              id="profile-username"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl px-5 py-4 bg-obsidian-900 border border-obsidian-600 text-white placeholder-obsidian-500 focus:outline-none focus:border-gold-500 transition-colors font-serif text-lg disabled:opacity-50"
              placeholder="Enter your preferred name"
              required
            />
          </div>

          <div className="p-8 rounded-2xl bg-obsidian-900/40 border border-obsidian-700 shadow-inner">
            <label htmlFor="profile-currency" className="flex items-center gap-3 text-[10px] font-bold mb-4 uppercase tracking-widest text-platinum-400">
              <Settings size={14} className="text-gold-500" />
              Base Currency
            </label>
            <select
              id="profile-currency"
              value={newCurrency}
              onChange={(e) => setNewCurrency(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl px-5 py-4 bg-obsidian-900 border border-obsidian-600 text-gold-400 focus:outline-none focus:border-gold-500 transition-colors font-bold tracking-widest disabled:opacity-50 appearance-none cursor-pointer"
            >
              {CURRENCIES.map(code => (
                <option key={code} value={code} className="bg-obsidian-900">{code}</option>
              ))}
            </select>
            <p className="text-[10px] font-bold uppercase tracking-widest text-platinum-500 mt-4 leading-relaxed">
              This establishes the global denomination for your wealth portfolio across all synchronized devices.
            </p>
          </div>

          {status.message && (
            <div className={`flex items-center gap-4 p-5 rounded-xl border font-bold text-xs uppercase tracking-widest shadow-inner ${status.type === 'success'
              ? 'bg-obsidian-900 border-gold-500/30 text-gold-500'
              : 'bg-red-900/20 border-red-500/30 text-red-400'
              }`}>
              {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (newUsername === currentUsername && newCurrency === currentCurrency) || !newUsername.trim()}
            className="w-full bg-gold-gradient hover:opacity-90 text-obsidian-900 font-bold text-sm uppercase tracking-widest py-5 px-4 rounded-xl transition duration-300 shadow-[0_10px_30px_rgba(212,175,55,0.2)] disabled:opacity-30 disabled:cursor-not-allowed flex justify-center items-center shimmer-effect"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5 text-obsidian-900" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Save Preferences'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileTab;
