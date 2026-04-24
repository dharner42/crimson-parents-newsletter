/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Lato', 'Helvetica', 'sans-serif'],
      },
      colors: {
        crimson: {
          50: '#fdf2f4',
          100: '#fce8eb',
          500: '#c41e3a',
          600: '#a51c30',
          700: '#8b1626',
          800: '#6d1020',
          900: '#4a0b16',
        },
      },
    },
  },
  plugins: [],
}
