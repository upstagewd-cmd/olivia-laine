/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F5EFE4",
        ink: "#241F1A",
        stone: "#8F8471",
        gold: "#A9822F",
        line: "#DED2BB",
        ondark: "#F5EFE4",
      },
      fontFamily: {
        sans: ["Archivo", "sans-serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
