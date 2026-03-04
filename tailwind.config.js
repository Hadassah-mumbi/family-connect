/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C5F8A",
        secondary: "#5A6B7C",
        background: "#F0F7FF",
        card: "#FFFFFF",
      },
      borderRadius: {
        'card': '24px',
        'button': '24px',
        'input': '12px',
      }
    },
  },
  plugins: [],
}