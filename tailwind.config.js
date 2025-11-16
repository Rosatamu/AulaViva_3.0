/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'quindio-green': '#228B22',
        'quindio-yellow': '#FFD700',
      },
    },
  },
  plugins: [],
};
