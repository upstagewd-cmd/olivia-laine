/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        stone: "rgb(var(--color-stone) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        ondark: "rgb(var(--color-ondark) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Archivo", "sans-serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
