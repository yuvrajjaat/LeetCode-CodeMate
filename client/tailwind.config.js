/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "lc-gray-1": "#282828",
        "lc-gray-2": "#1a1a1a",
        "lc-gray-3": "#3e3e3e",
        "lc-text-dark": "#bdbfc2",
        "lc-text-light": "#ffffff",
        "lc-orange": "#ffa116",
        "lc-green": "#00b8a3",
        "lc-red": "#ef4743",
        "lc-orange-alt": "#5e4e25",
        "lc-green-alt": "#294d35",
        "lc-red-alt": "#5a302f"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      width: {
        "90%": "90%"
      },
      screens: {
        "rptxl": "1600px"
      }
    },
  },
  plugins: [],
}
