import type { Config } from "tailwindcss"

export default {
  theme: {
    extend: {
      colors: {
        // 🎨 Brand + UI Colors
        background: "#fefffe",
        foreground: "#2d3748",
        primary: {
          DEFAULT: "#ff6b9d",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#fef7f0",
          foreground: "#2d3748",
        },
        muted: {
          DEFAULT: "#faf5f0",
          foreground: "#718096",
        },
        accent: {
          DEFAULT: "#fff0f5",
          foreground: "#2d3748",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#2d3748",
        },
        border: "rgba(255, 107, 157, 0.15)",
        input: "transparent",
        ring: "#ff6b9d",

        // Status colors
        destructive: {
          DEFAULT: "#e53e3e",
          foreground: "#ffffff",
        },
      },

      // 🔤 Fonts
      fontFamily: {
        heading: ["Amatic SC", "Kalam", "Patrick Hand", "cursive"],
        body: ["Lora", "Times New Roman", "serif"],
        serif: ["Crimson Text", "Times New Roman", "serif"],
        sans: ["Lora", "Times New Roman", "serif"], // default body
      },

      // 📐 Radii
      borderRadius: {
        sm: "0.5rem",
        md: "0.625rem",
        lg: "0.75rem",
        xl: "1rem",
      },

      // 🔠 Font sizes
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
        "7xl": "4.5rem",
      },
    },
  },
} satisfies Config