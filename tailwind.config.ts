import { type Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

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
        "ball-spin": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        "ball-bounce": {
          "0%": {
            transform: "translateY(-80px)",
          },
          "90%": {
            "animation-timing-function": "linear",
            transform: "translateY(-24px) scale(1, 1)",
          },
          "100%": {
            transform: "translateY(12px) scale(1.3, .7)",
          },
        },
        "shadow-scale": {
          "0%": {
            transform: "scaleX(0.75)",
          },
          "90%": {
            "animation-timing-function": "linear",
            transform: "scaleX(1)",
          },
          "100%": {
            transform: "scaleX(1.3)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ball-spin": "ball-spin 1s linear infinite",
        "ball-bounce": "ball-bounce 0.7s cubic-bezier(.5,0,.75,.2) infinite alternate",
        "shadow-scale": "shadow-scale 0.7s cubic-bezier(.5,0,.75,.2) infinite alternate",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
