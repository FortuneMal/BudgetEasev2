/** @type {import('tailwindcss').Config} */
export default {
  // The 'content' array tells Tailwind which files to scan for utility classes.
  // It's crucial for Tailwind to generate only the CSS you actually use.
  content: [
    "./index.html", // Your main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // All JS, TS, JSX, TSX files in the src directory
  ],
  theme: {
    extend: {
      // Extend Tailwind's default color palette with custom BudgetEase colors
      colors: {
        'budget-blue': {
          DEFAULT: '#3B82F6',   // A standard blue (Tailwind's blue-500)
          light: '#BFDBFE',     // Lighter blue for backgrounds (Tailwind's blue-200)
          dark: '#1E3A8A',      // Darker blue for text/headers (Tailwind's blue-900)
          'extra-dark': '#0B1E4A', // Even darker for strong contrast
        },
        'budget-white': '#FFFFFF', // Explicit white
        'budget-gray': {
          DEFAULT: '#F9FAFB', // Light gray for subtle backgrounds (Tailwind's gray-50)
          dark: '#6B7280',    // Darker gray for text (Tailwind's gray-500)
        },
      },
      // You can extend other theme properties here, e.g., spacing, typography
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Custom font family
      },
    },
  },
  plugins: [],
}
