// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Ensure dark mode works via class toggle
  theme: {
    extend: {
      colors: {
        obsidian: {
          900: 'rgb(var(--color-obsidian-900) / <alpha-value>)',
          800: 'rgb(var(--color-obsidian-800) / <alpha-value>)',
          700: 'rgb(var(--color-obsidian-700) / <alpha-value>)',
          600: 'rgb(var(--color-obsidian-600) / <alpha-value>)',
          500: 'rgb(var(--color-obsidian-500) / <alpha-value>)',
        },
        gold: {
          300: '#fceda8',
          400: '#e6c365',
          500: '#d4af37',
          600: '#b8942b',
          700: '#8f701c',
        },
        platinum: {
          100: 'rgb(var(--color-platinum-100) / <alpha-value>)',
          200: 'rgb(var(--color-platinum-200) / <alpha-value>)',
          300: 'rgb(var(--color-platinum-300) / <alpha-value>)',
          400: 'rgb(var(--color-platinum-400) / <alpha-value>)',
          500: 'rgb(var(--color-platinum-500) / <alpha-value>)',
        },
        champagne: {
          500: '#f7e7ce',
        },
        white: 'rgb(var(--color-white) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px 0 rgba(212, 175, 55, 0.1)' },
          '100%': { boxShadow: '0 0 25px 5px rgba(212, 175, 55, 0.3)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'luxury-gradient': 'linear-gradient(to right bottom, rgb(var(--color-obsidian-800)), rgb(var(--color-obsidian-900)))',
        'gold-gradient': 'linear-gradient(135deg, #e6c365 0%, #d4af37 50%, #b8942b 100%)',
      }
    },
  },
  plugins: [],
}
