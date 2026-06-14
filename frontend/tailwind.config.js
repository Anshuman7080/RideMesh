/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#111111',
          light: '#1e1e1e',
          dark: '#000000',
          gray: '#f3f3f3',
          darkgray: '#545454',
        },
        accent: {
          blue: '#276EF1',
          green: '#05A357',
          amber: '#FFC043',
          red: '#E11900',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
