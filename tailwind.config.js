/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        brand: {
          primary: '#C5E619',
          'primary-hover': '#A8CC00',
          secondary: '#1C1C1C',
          'light-bg': '#F9F9F9',
          'dark-bg': '#1C1C1C',
          'text-light': '#FFFFFF',
          'text-dark': '#333333',
        },
      },
    },
  },
  plugins: [],
}
