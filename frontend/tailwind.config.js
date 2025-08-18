/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enables manual dark mode via class
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // adjust if your files are in another folder
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5', // Indigo
        secondary: '#64748b', // Slate
        glass: 'rgba(255, 255, 255, 0.15)', // glass effect
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
