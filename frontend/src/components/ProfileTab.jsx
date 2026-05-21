import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { User, CheckCircle, AlertCircle, Shield, Settings } from 'lucide-react';

const ProfileTab = ({ theme, selectedCurrency, setSelectedCurrency, CURRENCIES }) => {
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
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
      setCurrentUsername(newUsername);
      setCurrentCurrency(newCurrency);
      setSelectedCurrency(newCurrency);
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center animate-fadeIn py-8">
      <div className={`rounded-3xl p-8 border shadow-2xl max-w-lg w-full ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
            <User size={28} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Profile Settings</h2>
            <p className={`text-sm font-medium mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Manage your account details and preferences.</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
            <label htmlFor="profile-username" className={`flex items-center gap-2 text-sm font-bold mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
              <Shield size={16} className="text-indigo-500" />
              Display Name
            </label>
            <input
              id="profile-username"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              disabled={loading}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 ${theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              placeholder="Enter a new username"
              required
            />
          </div>

          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
            <label htmlFor="profile-currency" className={`flex items-center gap-2 text-sm font-bold mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
              <Settings size={16} className="text-indigo-500" />
              Default Currency
            </label>
            <select
              id="profile-currency"
              value={newCurrency}
              onChange={(e) => setNewCurrency(e.target.value)}
              disabled={loading}
              className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 appearance-none font-bold ${theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-white'
                : 'bg-white border-gray-300 text-gray-900'
                }`}
            >
              {CURRENCIES.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <p className={`text-xs mt-3 font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-gray-500'}`}>
              This will update the default currency across all your devices.
            </p>
          </div>

          {status.message && (
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${status.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
              }`}>
              {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-semibold">{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (newUsername === currentUsername && newCurrency === currentCurrency) || !newUsername.trim()}
            className="w-full bg-indigo-500 text-white rounded-xl px-4 py-4 font-bold text-lg hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-lg shadow-indigo-500/30"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileTab;
