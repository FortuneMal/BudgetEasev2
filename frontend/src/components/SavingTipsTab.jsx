import React, { useState, useEffect } from 'react';

const SavingTipsTab = ({ totalIncome, totalExpenses, goals, categoryBudgets, selectedCurrency, selectedMonth, selectedYear, theme }) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatCurrency = (val) => new Intl.NumberFormat(navigator.language, { style: 'currency', currency: selectedCurrency }).format(val);

  const generateHeuristicTips = () => {
    const newTips = [];
    if (totalExpenses > totalIncome) {
      newTips.push(`URGENT: You are spending ${formatCurrency(totalExpenses - totalIncome)} more than you are earning this month. Review your highest category expenses immediately and halt non-essential spending.`);
    } else if (totalExpenses > totalIncome * 0.8) {
      newTips.push(`You are spending over 80% of your income. Try to adopt the 50/30/20 rule: 50% needs, 30% wants, and 20% savings.`);
    }
    
    if (totalIncome === 0) {
      newTips.push(`You haven't recorded any income for ${months[selectedMonth]}. Ensure your income sources are up to date to get accurate cash flow metrics.`);
    }

    if (goals.length > 0) {
      newTips.push(`You have active goals! Make sure you are setting aside at least 10% of your net positive cash flow towards them immediately after receiving income.`);
    } else {
      newTips.push(`You have no active financial goals. People who set specific savings goals save up to 30% more. Consider adding an Emergency Fund goal.`);
    }

    // Default fallback
    if (newTips.length < 3) {
      newTips.push(`Review your recurring subscriptions. The average person spends $200/month on forgotten subscriptions.`);
    }

    return newTips.slice(0, 3);
  };

  const fetchTips = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      // If no API key, use rich heuristics instead of crashing
      if (!apiKey || apiKey.trim() === '') {
        console.log("No Groq API key found. Using local heuristics.");
        setTimeout(() => {
          setTips(generateHeuristicTips());
          setLoading(false);
        }, 1200); // Simulate network delay for effect
        return;
      }

      const prompt = `You are a strict, concise, and helpful financial advisor. All currency values mentioned below are in ${selectedCurrency}. Here is my current financial profile for ${months[selectedMonth]} ${selectedYear}:
- Total Income: ${totalIncome}
- Total Expenses: ${totalExpenses}
- Net Cash Flow: ${totalIncome - totalExpenses}
- Active Goals: ${goals.length > 0 ? goals.map(g => g.name).join(', ') : 'None'}
- Category Budgets Setup: ${Object.keys(categoryBudgets).length > 0 ? Object.keys(categoryBudgets).join(', ') : 'None'}

Please give me 3 specific, actionable financial tips tailored exactly to this profile. Assess my expenses thoroughly and identify specific spending habits I should decrease. Limit your response to exactly 3 short bullet points. Do not include introductory text, just the bullet points.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      // Parse bullet points
      const parsedTips = content.split('\n')
        .map(line => line.replace(/^[-*•]\s*/, '').trim())
        .filter(line => line.length > 0);
        
      setTips(parsedTips);
    } catch (err) {
      console.warn("API Error, falling back to heuristics:", err);
      setTips(generateHeuristicTips());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-8 rounded-2xl shadow-lg border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className={`text-2xl font-bold flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <div className="p-2.5 bg-yellow-500/10 text-yellow-500 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            </div>
            Smart Financial Advisor
          </h3>
          <p className={`mt-2 font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
            Get personalized recommendations to boost your savings.
          </p>
        </div>
      </div>

      {!tips.length && !loading && (
        <div className={`flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed ${theme === 'dark' ? 'border-slate-700 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}>
          <button
            onClick={fetchTips}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl transition duration-300 shadow-lg shadow-indigo-500/30 flex items-center gap-2"
          >
            Generate My Personalized Tips
          </button>
        </div>
      )}

      {loading && (
        <div className={`p-8 rounded-2xl border flex items-center justify-center flex-col gap-4 ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800' : 'bg-gray-50 border-gray-100'}`}>
          <div className="flex items-center gap-3 text-indigo-500 font-bold text-lg tracking-wide">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing your profile...
          </div>
        </div>
      )}

      {tips.length > 0 && !loading && (
        <div className="space-y-4 animate-fadeIn">
          {tips.map((tip, idx) => (
            <label key={idx} className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer group ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}>
              <div className="pt-0.5">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500 transition-colors cursor-pointer" />
              </div>
              <p className={`font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-200' : 'text-gray-800'}`}>
                {tip}
              </p>
            </label>
          ))}
          
          <div className="mt-8 flex justify-end">
            <button 
              onClick={fetchTips} 
              className={`text-sm font-bold tracking-wide uppercase px-4 py-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-indigo-400 hover:bg-slate-800' : 'text-indigo-600 hover:bg-indigo-50'}`}
            >
              Refresh Tips
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingTipsTab;
