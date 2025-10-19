/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        positive: '#10B981',
        negative: '#EF4444',
        xp: '#F59E0B',
        streak: '#F97316',
      }
    },
  },
  plugins: [],
}