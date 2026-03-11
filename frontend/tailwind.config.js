/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        sand: '#f5f0e8',
        'sand-dark': '#ede5d8',
        ink: '#0d0d0d',
        gold: '#c9973a',
        teal: '#2a7c6f',
        coral: '#d45f3c',
      },
      scale: {
        '108': '1.08',
      },
    },
  },
  plugins: [],
};
