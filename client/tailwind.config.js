/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        primaryDark: "#1e3a8a",
        accent: "#f97316",
        success: "#16a34a",
        danger: "#dc2626",
        background: "#0f172a",
      },
    },
  },
  plugins: [],
};

