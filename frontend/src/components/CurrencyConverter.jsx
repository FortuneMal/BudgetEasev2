import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'ZAR', 'JPY', 'AUD', 'CAD'];

const CurrencyConverter = ({ theme }) => {
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
      // Using a free, reliable, no-key public API for exchange rates
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
      setError('Could not connect to exchange rate service.');
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
    <div className={`p-6 sm:p-8 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'} transition-all`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
          <ArrowRightLeft size={24} />
        </div>
        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Currency Converter</h3>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4 relative">
        <div className="w-full flex-1">
          <label className={`block text-xs font-semibold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>Amount & From</label>
          <div className="flex">
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full rounded-l-xl px-4 py-3 border-y border-l focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
            />
            <select 
              value={fromCurrency} 
              onChange={(e) => setFromCurrency(e.target.value)}
              className={`rounded-r-xl px-3 py-3 border focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold transition-colors appearance-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
            >
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={swapCurrencies}
          className={`shrink-0 mt-6 md:mt-0 p-3 rounded-full shadow-md transition-transform hover:rotate-180 duration-300 ${theme === 'dark' ? 'bg-slate-800 text-indigo-400 border border-slate-700 hover:bg-slate-700' : 'bg-white text-indigo-500 border border-gray-200 hover:bg-gray-50'}`}
        >
          <ArrowRightLeft size={20} />
        </button>

        <div className="w-full flex-1">
          <label className={`block text-xs font-semibold mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>To Currency</label>
          <select 
            value={toCurrency} 
            onChange={(e) => setToCurrency(e.target.value)}
            className={`w-full rounded-xl px-4 py-3 border focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold transition-colors appearance-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
          >
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className={`mt-8 p-6 rounded-xl border flex flex-col items-center justify-center min-h-[120px] ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800' : 'bg-gray-50 border-gray-100'}`}>
        {loading ? (
          <div className="animate-pulse flex space-x-2">
            <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
            <div className="h-3 w-3 bg-indigo-500 rounded-full animation-delay-200"></div>
            <div className="h-3 w-3 bg-indigo-500 rounded-full animation-delay-400"></div>
          </div>
        ) : error ? (
          <p className="text-rose-500 font-medium">{error}</p>
        ) : convertedAmount !== null ? (
          <>
            <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
              {amount} {fromCurrency} equals
            </p>
            <p className={`text-4xl font-extrabold font-['Outfit'] bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500`}>
              {formatCurrency(convertedAmount, toCurrency)}
            </p>
            <p className={`text-xs mt-3 ${theme === 'dark' ? 'text-slate-500' : 'text-gray-400'}`}>
              1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CurrencyConverter;
