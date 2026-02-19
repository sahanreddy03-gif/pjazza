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
          DEFAULT: "#FAF7F2",
          card: "#FFFFFF",
          alt: "#F5F0E8",
        },
        ink: {
          DEFAULT: "#2D2A24",
          secondary: "#6B6560",
          muted: "#9C958D",
        },
        line: {
          DEFAULT: "#E8E2D8",
          light: "#F0EBE3",
        },
        trust: "#1A8A5C",
        live: "#E05A3A",
        premium: "#7C3AED",
        info: "#2563EB",
        warn: "#D97706",
        navy: "#1A1A2E",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
