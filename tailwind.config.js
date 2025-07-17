module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#21583F",
        secondary: "#437837",
        accent: "#6F965E",
        wheat: "#F7F1E4",
        gold: "#F1E944",
        brown: "#995E3B"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Lora", "serif"]
      }
    },
  },
  plugins: [],
}