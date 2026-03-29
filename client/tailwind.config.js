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
        panel: "0 18px 40px rgba(36, 52, 71, 0.06)",
      },
      fontFamily: {
        sans: ["Manrope", "'Segoe UI'", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "app-wash":
          "radial-gradient(circle at top left, rgba(139,184,217,0.24), transparent 28%), radial-gradient(circle at bottom right, rgba(214,191,168,0.18), transparent 24%), linear-gradient(180deg, #f8fbfd 0%, #f8f3ee 100%)",
      },
    },
  },
  plugins: [],
};
