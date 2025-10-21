/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#FFF8F4",
        surface: "#EBD4CF",
        accent1: "#D98C6A",
        accent2: "#B58B8B",
        accent3: "#E6CDB6",
        neutral: "#4B4444",
        success: "#B6C4AA",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Manrope", "sans-serif"],
        poetic: ["Cormorant Garamond", "serif"],
      },
    },
  },
  plugins: [],
};
