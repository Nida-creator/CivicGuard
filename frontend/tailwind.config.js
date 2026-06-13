/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pk-green': {
          DEFAULT: '#01411C',
          light: '#015c28',
          dark: '#012d14',
          pale: '#e8f5ee',
          mid: '#d0ead9',
        },
        'pk-navy': {
          DEFAULT: '#0A2A66',
          light: '#0d3580',
          pale: '#e8eef8',
        },
      },
      fontFamily: {
        urdu: ['"Noto Nastaliq Urdu"', 'serif'],
      },
    },
  },
  plugins: [],
}
