/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'purple': {
          500: '#6D28D9',
          600: '#5B21B6',
        },
        'orange': {
          500: '#EA580C',
          600: '#C2410C',
        },
      },
    },
  },
  plugins: [],
};