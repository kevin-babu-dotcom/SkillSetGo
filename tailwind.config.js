/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Add this line
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