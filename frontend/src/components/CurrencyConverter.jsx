import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'ZAR', 'JPY', 'AUD', 'CAD'];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExchangeRate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
      const data = await response.json();
      
      if (data.result === 'success') {
        const rate = data.rates[toCurrency];
        setExchangeRate(rate);
        setConvertedAmount(parseFloat(amount) * rate);
      } else {
        throw new Error('Failed to fetch exchange rates');
      }
    } catch (err) {
      setError('Service temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency, amount]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (val, cur) => {
    return new Intl.NumberFormat(navigator.language, {
      style: 'currency',
      currency: cur,
    }).format(val);
  };

  return (
    <div className="glass-card p-8 sm:p-12 rounded-2xl relative border-gold-gradient z-10">
      <div className="flex items-center gap-4 mb-10 border-b border-obsidian-700/50 pb-6">
        <div className="p-3 bg-obsidian-900 border border-obsidian-700 rounded-xl text-gold-500 shadow-inner">
          <ArrowRightLeft size={20} />
        </div>
        <div>
          <h3 className="text-2xl font-serif text-white tracking-wide">Global Exchange</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-platinum-500 mt-1">Real-time market rates</p>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-6 relative">
        <div className="w-full flex-1">
          <label className="block text-[10px] font-bold mb-3 uppercase tracking-widest text-platinum-400">Origin Capital</label>
          <div className="flex shadow-inner rounded-xl overflow-hidden border border-obsidian-600 bg-obsidian-900/50">
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-5 py-4 bg-transparent text-white placeholder-obsidian-500 focus:outline-none focus:bg-obsidian-900 transition-colors font-serif text-lg"
            />
            <div className="w-px bg-obsidian-600"></div>
            <select 
              value={fromCurrency} 
              onChange={(e) => setFromCurrency(e.target.value)}
              className="px-4 py-4 bg-transparent focus:outline-none focus:bg-obsidian-900 font-bold tracking-widest text-gold-400 transition-colors appearance-none cursor-pointer"
            >
              {CURRENCIES.map(c => <option key={c} value={c} className="bg-obsidian-900">{c}</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={swapCurrencies}
          className="shrink-0 mt-6 md:mt-0 p-4 rounded-full bg-obsidian-900 border border-obsidian-600 shadow-inner text-gold-500 transition-transform hover:rotate-180 hover:border-gold-500/50 duration-500"
        >
          <ArrowRightLeft size={20} />
        </button>

        <div className="w-full flex-1">
          <label className="block text-[10px] font-bold mb-3 uppercase tracking-widest text-platinum-400">Target Currency</label>
          <select 
            value={toCurrency} 
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full rounded-xl px-5 py-4 bg-obsidian-900/50 border border-obsidian-600 text-gold-400 focus:outline-none focus:bg-obsidian-900 font-bold tracking-widest transition-colors appearance-none shadow-inner cursor-pointer"
          >
            {CURRENCIES.map(c => <option key={c} value={c} className="bg-obsidian-900">{c}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-10 p-8 rounded-2xl border border-obsidian-700 bg-obsidian-900/40 flex flex-col items-center justify-center min-h-[160px] shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-obsidian-900/50 pointer-events-none"></div>
        
        {loading ? (
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        ) : error ? (
          <p className="text-red-400 font-bold text-xs uppercase tracking-widest relative z-10">{error}</p>
        ) : convertedAmount !== null ? (
          <div className="text-center relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-platinum-400 mb-2">
              Market Conversion
            </p>
            <p className="text-5xl font-serif tracking-wide text-white drop-shadow-lg">
              {formatCurrency(convertedAmount, toCurrency)}
            </p>
            <div className="mt-4 inline-block px-4 py-1.5 rounded-full border border-obsidian-600 bg-obsidian-900 text-[10px] font-bold tracking-widest text-gold-500">
              1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CurrencyConverter;
