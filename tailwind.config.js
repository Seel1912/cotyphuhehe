/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './Monopoly.tsx'],
  safelist: [
    'bg-pink-500/80',
    'bg-lime-500/80',
    'bg-blue-500/80',
    'bg-cyan-500/80',
    'bg-yellow-500/80',
    'bg-orange-500/80',
    'bg-green-500/80',
    'bg-red-500/80',
    'bg-purple-500/80',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};