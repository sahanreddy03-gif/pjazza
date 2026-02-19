import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pjazza: {
          gold: "#C4941E",
          honey: "#D4A843",
          coral: "#E05A3A",
        },
        surface: {
          DEFAULT: "#f5f5f7",
          card: "#ffffff",
          alt: "#e8e8ed",
        },
        ink: {
          DEFAULT: "#1d1d1f",
          secondary: "#6e6e73",
          muted: "#86868b",
        },
        line: {
          DEFAULT: "#d2d2d7",
          light: "#e8e8ed",
        },
        trust: "#34c759",
        live: "#ff3b30",
        premium: "#af52de",
        info: "#007aff",
        warn: "#ff9500",
        navy: "#1d1d1f",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
      },
      borderRadius: {
        apple: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
