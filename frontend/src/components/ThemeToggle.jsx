import React from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-obsidian-800/50 border border-obsidian-700 text-gold-500 hover:text-gold-400 hover:border-gold-500/50 transition-all shadow-inner group flex items-center justify-center"
      aria-label="Toggle Theme"
      title="Toggle Light/Dark Mode"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="group-hover:rotate-90 transition-transform duration-500" />
      ) : (
        <Moon size={18} className="group-hover:-rotate-12 transition-transform duration-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
