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
          black:    '#080808',
          'black-soft': '#111111',
          'black-card': '#161616',
          cream:    '#F5F0E8',
          'cream-muted': '#C8C0B0',
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
