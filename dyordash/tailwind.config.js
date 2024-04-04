/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: 'rgb(75, 192, 192)', 
        cyan1: 'rgb(75,192,192,0.2)',
      },
      fontFamily: {
        'mont': ['Montserrat', 'sans-serif'],
        'bebas': ["Bebas Neue", 'sans-serif']
      }
    },
  },
  plugins: [],
}