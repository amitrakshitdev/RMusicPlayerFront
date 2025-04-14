import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        accent100: "#A6F3FF",
        accent200: "#44D7DD",
        accent300: "#00C2CB",
        accent400: "#1DB1B7",
        accent500: "#446266",
        bgLight: "#FFFFFF",
        bgDark: "#1E1E1E",
        textLight: "#FFFFFF",
        textDark: "#8A9A9D",
      },
      fontFamily: {
        centuryGothic: "var(--font-centuryGothic)",
        mullish: "var(--font-mullish)",
      }
    },
  },
  plugins: [],
} satisfies Config;
