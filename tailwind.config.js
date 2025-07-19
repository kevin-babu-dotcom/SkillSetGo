/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'], // Make Inter the default sans-serif font
        outfit: ['var(--font-outfit)'], // Create a custom utility class for Outfit
      },
      colors: {
        'primary-orange': '#FF5722',
      }
    },
  },
  plugins: [],
}