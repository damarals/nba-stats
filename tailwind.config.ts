import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Path to the tremor module
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      gridTemplateRows: {
        // Simple 15 row grid
        "15": "repeat(15, minmax(0, 1fr))",
      },
      gridRow: {
        "span-14": "span 14 / span 14",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "ball-bounce": {
          "0%": {
            transform: "scale(1.3, 0.8) translate3d(0, 0, 0)",
          },
          "10%": {
            transform: "scale(0.8, 1.1) translate3d(0, -20px, 0)",
          },
          "30%": {
            transform: "scale(0.99, 1.01) translate3d(0, -70px, 0)",
          },
          "60%": {
            transform: "scale(1, 1) translate3d(0, -80px, 0)",
          },
          "80%": {
            transform: "scale(0.81, 1.09) translate3d(0, -30px, 0)",
          },
          "90%": {
            transform: "scale(0.8, 1.1) translate3d(0, -20px, 0)",
          },
          "100%": {
            transform: "scale(1.3, 0.8) translate3d(0, 0, 0)",
          },
        },
        "shadow-scale": {
          "0%": {
            transform: "scaleX(1.3)",
          },
          "10%": {
            transform: "scaleX(0.8)",
          },
          "30%": {
            transform: "scaleX(0.99)",
          },
          "60%": {
            transform: "scaleX(1)",
          },
          "80%": {
            transform: "scaleX(0.81)",
          },
          "90%": {
            transform: "scaleX(0.8)",
          },
          "100%": {
            transform: "scaleX(1.3)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ball-bounce": "ball-bounce 1.25s ease-in infinite",
        "shadow-scale": "shadow-scale 1.25s ease-in infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
