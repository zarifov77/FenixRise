/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pumpkin:  "#FE7F2D",
        "pumpkin-light": "#FF9A52",
        eerie:    "#212223",
        "eerie-card": "#28292A",
        "eerie-dark": "#1A1B1C",
        "eerie-border": "rgba(255,255,255,0.07)",
        ash:      "#9B9C9E",
        "off-white": "#F5F4F2",
      },
      fontFamily: {
        sans:    ["'Inter'", "sans-serif"],
        display: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "28px",
      },
    },
  },
  plugins: [],
};
