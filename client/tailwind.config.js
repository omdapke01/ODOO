/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        mist: "#f4f7fb",
        shell: "#f9f4ef",
        ink: "#243447",
        sage: "#95b8a7",
        clay: "#d6bfa8",
        ocean: "#8bb8d9",
        rose: "#e8c7c8"
      },
      boxShadow: {
        soft: "0 24px 60px rgba(36, 52, 71, 0.08)",
      },
      fontFamily: {
        sans: ["'Segoe UI'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
