// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define a custom primary color for your minimalist theme
        primary: {
          light: '#E0F2F7', // Very light blue for subtle accents
          DEFAULT: '#3F72AF', // A muted, professional blue for main accents
          dark: '#1C314A',   // Darker blue for text/headers
        },
        gray: {
          100: '#F5F5F5', // Very light gray for backgrounds
          200: '#EEEEEE', // Light gray for subtle borders/dividers
          300: '#E0E0E0', // Slightly darker gray for input borders
          600: '#757575', // For secondary text
          800: '#424242', // For main text
        },
        // Using existing red for errors
        red: {
          500: '#EF4444',
          600: '#DC2626',
        },
        // Using existing green for success buttons
        green: {
          600: '#16A34A',
          700: '#15803D',
        }
      },
      fontFamily: {
        // Using Inter as before, which fits well with minimalism
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

