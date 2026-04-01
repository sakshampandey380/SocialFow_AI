/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5fbff",
          100: "#e9f7ff",
          200: "#cfeeff",
          300: "#a7ddff",
          400: "#69c2ff",
          500: "#1e9bff",
          600: "#0b75db",
          700: "#0b5eb0",
          800: "#104d8e",
          900: "#154172",
        },
        accent: {
          100: "#fff0e8",
          300: "#ffb88a",
          500: "#ff7a2f",
        },
        surface: {
          50: "#fcfdff",
          100: "#f4f7fb",
          900: "#09111f",
        },
      },
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui"],
        body: ["Manrope", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glow: "0 20px 60px rgba(30, 155, 255, 0.2)",
        glass: "0 12px 40px rgba(15, 23, 42, 0.12)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at top left, rgba(105,194,255,0.35), transparent 32%), radial-gradient(circle at top right, rgba(255,122,47,0.20), transparent 24%), linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,246,255,0.85))",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.95" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
