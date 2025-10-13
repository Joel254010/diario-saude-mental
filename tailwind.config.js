/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#f8f6fc',
          100: '#efe9f8',
          200: '#e1d4f3',
          300: '#cbb4e9',
          400: '#b49edc',
          500: '#9b7fcf',
          600: '#8561c0',
          700: '#724ea9',
          800: '#5f428b',
          900: '#4f3972',
        },
      },
      fontFamily: {
        sans: ['Quicksand', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
