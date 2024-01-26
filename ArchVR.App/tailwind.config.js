/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'
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
        "secondary": "oklch(74.8% 0.26 342.55)",
        "accent": "oklch(74.51% 0.167 183.61)",
        "neutral": "#2a323c",
        "neutral-content": "#A6ADBB",
        "base-100": "#1d232a",
        "base-200": "#191e24",
        "base-300": "#15191e",
        "base-content": "#A6ADBB",
      },
    },"light"],
  },
  theme: {
    container: {
      center: true,
      padding:'1rem'
    },
    extend: {

    },
  },
  plugins: [daisyui],
};
