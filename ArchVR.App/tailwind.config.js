/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'
import daisyui from 'daisyui'
export default {
  content: [
    "./presets/**/*.{js,vue,ts}",
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  daisyui:{
    themes:[{
      dark: {
        "color-scheme": "dark",
        "primary": "#FF9800",
        "primary-content": "#1c1203",
        "secondary": "oklch(74.8% 0.26 342.55)",
        "accent": "oklch(74.51% 0.167 183.61)",
        "neutral": "#262d36",
        "neutral-content": "#aab2bf",
        // base-200 is the page, base-100 a raised panel, base-300 a well
        "base-100": "#1b2027",
        "base-200": "#15191f",
        "base-300": "#101318",
        "base-content": "#b4bcc8",
        "--rounded-box": "0.75rem",
        "--rounded-btn": "0.5rem",
        "--animation-btn": "0.15s",
      },
    },"light"],
  },
  theme: {
    container: {
      center: true,
      padding:'1rem'
    },
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', ...defaultTheme.fontFamily.sans],
        mono: ['"IBM Plex Mono"', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [daisyui],
};
