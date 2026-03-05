/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#007B83",
        "primary-hover": "#00666d",
        "background-light": "#F8FAFC",
        "background-dark": "#0F172A",
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}