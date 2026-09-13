import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af", // Primary brand blue
          900: "#1e3a8a",
        },
        navy: {
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#0a0f1d", // Midnight navy
        },
        accent: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706", // Quote CTA accent
          700: "#b45309",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        "premium-card": "0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)",
        "premium-hover": "0 16px 32px -4px rgba(15, 23, 42, 0.09), 0 4px 12px -2px rgba(15, 23, 42, 0.04)",
        "premium-nav": "0 4px 24px -4px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
