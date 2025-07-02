/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        btnBg: "#FF4081",
        btnText: "#FFFFFF",
        appBg: "#F9F9F9",
        heading: "#333333",
        paragraph: "#666666",
      },
    },
  },
  plugins: [],
};
