import { defineConfig } from 'windicss/helpers'
import formsPlugin from 'windicss/plugin/forms'
import daisyui from "daisyui";
import daisyuicolors from "daisyui/colors";

export default defineConfig({
  darkMode: 'class',
  safelist: '', // whitelist classes
  theme: {
    extend: {
      colors: { ...daisyuicolors },
    },
  },
  plugins: [
    formsPlugin,
    daisyui
  ],
})
