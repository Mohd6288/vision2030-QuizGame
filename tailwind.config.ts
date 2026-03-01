import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        saudi: {
          green: "#006C35",
          gold: "#FFD700",
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 4s linear infinite",
        "rotate-slow": "rotateSlow 30s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
