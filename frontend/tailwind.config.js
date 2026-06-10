/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:  '#0A1F5C',
          blue:  '#1A56DB',
          sky:   '#3B82F6',
          light: '#EBF2FF',
          pale:  '#F5F8FF',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}