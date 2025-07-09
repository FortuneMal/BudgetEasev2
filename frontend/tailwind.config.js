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
          light: '#E0F2F7', // Very light blue for backgrounds
          DEFAULT: '#3F72AF', // A muted, professional blue
          dark: '#1C314A',   // Darker blue for text/headers
        },
        gray: {
          100: '#F5F5F5', // Lighter gray for subtle backgrounds
          200: '#EEEEEE',
          300: '#E0E0E0', // For borders
          600: '#757575', // For secondary text
          800: '#424242', // For main text
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
