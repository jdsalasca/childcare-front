/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html"
  ],
  corePlugins: {
    preflight: false, // This prevents Tailwind from resetting PrimeReact styles
  },
  theme: {
    extend: {},
  },
  plugins: [],
}