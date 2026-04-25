import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f0d0d",
        panel: "#1b1715",
        accent: "#7a1c1d",
        brass: "#ad8a46",
        parchment: "#efe4ce",
        steel: "#5f718a",
        forest: "#49634b",
        amethyst: "#6a4e8f",
        ember: "#8a3a32"
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
