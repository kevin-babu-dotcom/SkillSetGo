// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',  // Make sure this captures your Navbar.js
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 1. Add your custom font families
      fontFamily: {
  'outfit': ['var(--font-outfit)', 'sans-serif'],  // Outfit is sans-serif
  'inter': ['var(--font-inter)', 'sans-serif'],    // Inter is sans-serif
}
    },
    // Override the default sans font to use Outfit
    fontFamily: {
      'sans': ['var(--font-outfit)', 'sans-serif'],  // Make Outfit the default
      'serif': ['Georgia', 'serif'],
      'mono': ['Menlo', 'Monaco', 'monospace'],
      'outfit': ['var(--font-outfit)', 'sans-serif'],
      'inter': ['var(--font-inter)', 'sans-serif'],
    }
  },
  plugins: [],
};