import React, { useState } from 'react';
import { Diamond } from 'lucide-react';

const SavingTipsTab = ({ totalIncome, totalExpenses, goals, categoryBudgets, selectedCurrency, selectedMonth, selectedYear }) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (val) => new Intl.NumberFormat(navigator.language, { style: 'currency', currency: selectedCurrency }).format(val);

  const generateHeuristicTips = () => {
    const newTips = [];
    if (totalExpenses > totalIncome) {
      newTips.push(`Portfolio Alert: Your current expenditure exceeds capital inflow by ${formatCurrency(totalExpenses - totalIncome)}. Immediate review of discretionary spending is advised to preserve wealth.`);
    } else if (totalExpenses > totalIncome * 0.8) {
      newTips.push(`Wealth Strategy: Your outflow represents over 80% of your income. Consider adopting a stricter 50/30/20 allocation model to ensure consistent portfolio growth.`);
    }
    
    if (totalIncome === 0) {
      newTips.push(`Data Incomplete: No capital inflow recorded for ${months[selectedMonth]}. Ensure all revenue streams are accurately logged for precise advisory metrics.`);
    }

    if (goals.length > 0) {
      newTips.push(`Capital Allocation: You have active financial objectives. Ensure you are automatically diverting at least 10% of net positive cash flow towards these targets.`);
    } else {
      newTips.push(`Strategic Planning: You lack defined financial objectives. Portfolios with explicit targets tend to accumulate wealth 30% faster. We recommend establishing a robust emergency reserve immediately.`);
    }

    if (newTips.length < 3) {
      newTips.push(`Audit Recommendation: Conduct a thorough review of recurring capital outflows. Eliminating redundant subscriptions is a key pillar of wealth retention.`);
    }

    return newTips.slice(0, 3);
  };

  const fetchTips = async () => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      if (!apiKey || apiKey.trim() === '') {
        setTimeout(() => {
          setTips(generateHeuristicTips());
          setLoading(false);
        }, 1500);
        return;
      }

      const prompt = `You are an elite, concise, and highly professional private wealth advisor. All currency values are in ${selectedCurrency}. Here is the client's portfolio for ${months[selectedMonth]} ${selectedYear}:
- Total Inflow: ${totalIncome}
- Total Outflow: ${totalExpenses}
- Net Cash Flow: ${totalIncome - totalExpenses}
- Active Objectives: ${goals.length > 0 ? goals.map(g => g.name).join(', ') : 'None'}
- Allocations: ${Object.keys(categoryBudgets).length > 0 ? Object.keys(categoryBudgets).join(', ') : 'None'}

Provide exactly 3 strategic, actionable wealth management directives based on this data. Use sophisticated financial terminology. Do not include introductory text, just the 3 bullet points.`;

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

      if (!response.ok) throw new Error(`API error`);

      const data = await response.json();
      const content = data.choices[0].message.content;
      const parsedTips = content.split('\n')
        .map(line => line.replace(/^[-*•]\s*/, '').trim())
        .filter(line => line.length > 0);
        
      setTips(parsedTips);
    } catch (err) {
      setTips(generateHeuristicTips());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 sm:p-12 rounded-2xl relative border-gold-gradient max-w-4xl mx-auto z-10">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none rounded-2xl"></div>
      
      <div className="flex justify-between items-center mb-10 border-b border-obsidian-700/50 pb-6 relative z-10">
        <div>
          <h3 className="text-2xl font-serif text-white tracking-wide flex items-center gap-4">
            <div className="p-2 bg-obsidian-900 border border-obsidian-700 rounded-lg text-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Diamond size={20} />
            </div>
            Private Wealth Advisor
          </h3>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-platinum-500">
            Algorithmic Portfolio Recommendations
          </p>
        </div>
      </div>

      {!tips.length && !loading && (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-dashed border-obsidian-700 bg-obsidian-900/30 relative z-10">
          <button
            onClick={fetchTips}
            className="bg-gold-gradient hover:opacity-90 text-obsidian-900 font-bold text-xs uppercase tracking-widest py-4 px-8 rounded-xl transition duration-300 shadow-[0_10px_30px_rgba(212,175,55,0.2)] flex items-center gap-3 shimmer-effect"
          >
            Generate Portfolio Directives
          </button>
        </div>
      )}

      {loading && (
        <div className="p-16 rounded-2xl border border-obsidian-700 bg-obsidian-900/50 flex items-center justify-center flex-col gap-6 relative z-10">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 border-t-2 border-gold-500 rounded-full animate-spin"></div>
            <Diamond size={16} className="text-gold-500 animate-pulse" />
          </div>
          <div className="text-gold-500 font-bold text-xs uppercase tracking-widest animate-pulse">
            Analyzing Financial Data...
          </div>
        </div>
      )}

      {tips.length > 0 && !loading && (
        <div className="space-y-6 animate-fadeIn relative z-10">
          {tips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-5 p-6 rounded-2xl bg-obsidian-900/60 border border-obsidian-700 shadow-inner group hover:border-gold-500/30 transition-colors cursor-default">
              <div className="pt-1">
                <div className="w-2 h-2 rounded-full bg-gold-500 shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
              </div>
              <p className="font-serif text-lg leading-relaxed text-platinum-200 group-hover:text-white transition-colors">
                {tip}
              </p>
            </div>
          ))}
          
          <div className="mt-10 flex justify-end">
            <button 
              onClick={fetchTips} 
              className="text-[10px] font-bold uppercase tracking-widest text-platinum-400 hover:text-gold-500 transition-colors border-b border-transparent hover:border-gold-500 pb-1"
            >
              Request Updated Directives
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingTipsTab;
