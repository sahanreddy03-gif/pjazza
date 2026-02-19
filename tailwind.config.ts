import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0a0a0a",
        ink: "#ededed",
        line: "#262626",
        trust: "#16a34a",
        warn: "#f59e0b",
        danger: "#ef4444",
        navy: "#0f172a",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
