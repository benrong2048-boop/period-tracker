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
        soft: {
          rose: "#fce7f3",
          peach: "#ffedd5",
          mint: "#d1fae5",
          lavender: "#ede9fe",
          sky: "#e0f2fe",
        },
      },
    },
  },
  plugins: [],
};
export default config;
