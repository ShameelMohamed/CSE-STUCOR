// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Arial', 'Helvetica', 'sans-serif'],
      },
      colors: {
        // Design System tokens
        clay: {
          background: '#EAEBEE',       // Light bg
          surface: '#F3F4F7',          // Light card surface
          darkBackground: '#18181B',   // Dark bg (Zinc 900)
          darkSurface: '#27272A',      // Dark card surface (Zinc 800)
        },
        // Primary accent — updated to vibrant Indigo
        department: '#4F46E5',
        departmentDark: '#818CF8',
      },
      boxShadow: {
        // Double-layer claymorphism — Light Mode
        clay: '0 8px 32px rgba(160,172,201,0.45), inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -3px 8px rgba(160,172,201,0.2)',
        clayHover: '0 16px 48px rgba(160,172,201,0.6), inset 0 1px 1px rgba(255,255,255,0.9)',
        // Double-layer claymorphism — Dark Mode
        clayDark: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px rgba(255,255,255,0.06), inset 0 -2px 6px rgba(0,0,0,0.35)',
        clayDarkHover: '0 16px 48px rgba(0,0,0,0.7), inset 0 1px rgba(255,255,255,0.07)',
        // Inset clay for inputs
        clayInset: 'inset 0 2px 6px rgba(160,172,201,0.4), inset 0 -1px rgba(255,255,255,0.6)',
        clayInsetDark: 'inset 0 3px 8px rgba(0,0,0,0.5), inset 0 -1px rgba(255,255,255,0.04)',
      },
      borderRadius: {
        clay: '28px',
        clayLg: '36px',
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        blob: "blob 7s infinite",
        marquee: 'marquee 25s linear infinite',
        marqueeReverse: 'marqueeReverse 25s linear infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;