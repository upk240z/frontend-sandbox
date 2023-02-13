/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      '*.html',
      './src/**/*.{ts,css}'
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
