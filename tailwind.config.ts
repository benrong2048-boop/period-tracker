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
        // 樱花粉、柔和粉、云雾粉
        blossom: "#ffb7c5",
        soft: "#ffd6e0",
        cloud: "#ffe8ef",
        // 辅助色：淡紫、浅珊瑚
        lavender: "#e8d5f2",
        coral: "#ffc9b9",
        // 文字与边框
        ink: "#5c4a4a",
        inkLight: "#8a7a7a",
      },
      backgroundImage: {
        "gradient-sky": "linear-gradient(135deg, #ffe8ef 0%, #ffd6e0 30%, #e8d5f2 70%, #ffe8ef 100%)",
        "gradient-soft": "linear-gradient(180deg, #fff5f7 0%, #ffe8ef 50%, #ffd6e0 100%)",
      },
      boxShadow: {
        float: "0 8px 32px rgba(255, 182, 193, 0.25)",
        floatHover: "0 12px 40px rgba(255, 182, 193, 0.35)",
        glass: "0 4px 24px rgba(255, 255, 255, 0.4)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        gradient: "gradient 15s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
