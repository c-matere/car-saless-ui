/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          800: 'rgba(38, 38, 38, 0.9)',
          900: 'rgba(23, 23, 23, 0.9)',
        },
      },
    },
  },
  plugins: [],
}
