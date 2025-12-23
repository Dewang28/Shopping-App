module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff3f6c",
        textPrimary: "#282c3f",
        textSecondary: "#696b79",
        border: "#eaeaec",
        muted: "#f5f5f6",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
