import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        morandi: {
          bg: "#f5f3f0",
          card: "#faf9f7",
          gray: "#6b6b6b",
          dark: "#4a4a4a",
          pink: "#c4a8a0",
          pinkLight: "#e8dcd8",
          stone: "#a89f96",
          border: "#e5e2de",
        },
      },
      boxShadow: {
        card: "0 2px 12px rgba(74,74,74,0.06)",
        cardHover: "0 4px 20px rgba(74,74,74,0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
