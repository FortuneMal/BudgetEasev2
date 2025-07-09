// frontend/src/components/CurrencyConverter.jsx
import React, { useState } from 'react';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConvert = async (e) => {
        e.preventDefault();
        setError('');
        setConvertedAmount(null);
        setLoading(true);

        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid amount.');
            setLoading(false);
            return;
        }

        try {
            // This endpoint needs to be implemented in your backend (Phase 4)
            const response = await fetch(`http://localhost:3001/api/currency/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
            const data = await response.json();

            if (response.ok) {
                setConvertedAmount(data.convertedAmount);
            } else {
                setError(data.message || 'Failed to convert currency.');
            }
        } catch (err) {
            setError('Network error or server issue during conversion.');
            console.error('Currency conversion error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"> {/* Minimalist card styling */}
            <h2 className="text-2xl font-bold text-primary-dark mb-4">Currency Converter</h2>
            <form onSubmit={handleConvert} className="space-y-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none"
                        placeholder="e.g., 100"
                        step="0.01"
                        required
                    />
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700">From</label>
                        <select
                            id="fromCurrency"
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none"
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="ZAR">ZAR</option>
                            <option value="JPY">JPY</option>
                            <option value="CAD">CAD</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700">To</label>
                        <select
                            id="toCurrency"
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none"
                        >
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="GBP">GBP</option>
                            <option value="ZAR">ZAR</option>
                            <option value="JPY">JPY</option>
                            <option value="CAD">CAD</option>
                        </select>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md shadow-sm transition duration-300 ease-in-out hover:bg-opacity-90"
                    disabled={loading}
                >
                    {loading ? 'Converting...' : 'Convert'}
                </button>
            </form>
            {convertedAmount !== null && (
                <p className="mt-4 text-center text-lg font-semibold text-green-700">
                    {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
                </p>
            )}
            {error && (
                <p className="mt-4 text-center text-red-500">{error}</p>
            )}
        </div>
    );
};

export default CurrencyConverter;

