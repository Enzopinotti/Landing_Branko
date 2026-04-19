/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black:    '#030303',
          'black-soft': '#060606',
          'black-card': 'rgba(255, 255, 255, 0.03)',
          cream:    '#F5F0E8',
          'cream-muted': 'rgba(245, 240, 232, 0.4)',
          gold:     '#C9A96E',
          'gold-light': '#DFC08A',
        },
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['Montserrat', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
