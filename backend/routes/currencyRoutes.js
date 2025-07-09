// backend/routes/currencyRoutes.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // You might need to install node-fetch: npm install node-fetch

// @desc    Get latest exchange rates for a base currency
// @route   GET /api/currency/rates/:base
// @access  Public (or Private if you want to limit API calls)
router.get('/rates/:base', async (req, res) => {
    const baseCurrency = req.params.base.toUpperCase();
    const apiKey = process.env.CURRENCY_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ message: 'Currency API key not configured on server.' });
    }

    try {
        // Example using ExchangeRate-API (adjust URL for your chosen API)
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`);
        const data = await response.json();

        if (data.result === 'success') {
            res.json(data.conversion_rates);
        } else {
            res.status(data.status || 500).json({ message: data.error_type || 'Failed to fetch exchange rates.' });
        }
    } catch (error) {
        console.error('Error fetching currency rates:', error);
        res.status(500).json({ message: 'Server error fetching currency rates.' });
    }
});

// @desc    Convert an amount from one currency to another
// @route   GET /api/currency/convert?from=USD&to=EUR&amount=100
// @access  Public (or Private)
router.get('/convert', async (req, res) => {
    const { from, to, amount } = req.query;
    const apiKey = process.env.CURRENCY_API_KEY;

    if (!from || !to || !amount || isNaN(amount)) {
        return res.status(400).json({ message: 'Please provide valid from, to, and amount parameters.' });
    }
    if (!apiKey) {
        return res.status(500).json({ message: 'Currency API key not configured on server.' });
    }

    try {
        // Example using ExchangeRate-API (adjust URL for your chosen API)
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from.toUpperCase()}/${to.toUpperCase()}/${amount}`);
        const data = await response.json();

        if (data.result === 'success') {
            res.json({
                from: data.base_code,
                to: data.target_code,
                amount: parseFloat(amount),
                convertedAmount: data.conversion_result,
                rate: data.conversion_rate,
            });
        } else {
            res.status(data.status || 500).json({ message: data.error_type || 'Failed to convert currency.' });
        }
    } catch (error) {
        console.error('Error converting currency:', error);
        res.status(500).json({ message: 'Server error converting currency.' });
    }
});

module.exports = router;

