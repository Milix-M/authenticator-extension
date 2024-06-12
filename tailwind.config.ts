/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
import { supportedTheme } from './src/supportedTheme'

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui, require("tailwind-scrollbar")],
  daisyui: {
    themes: supportedTheme
  },
};
