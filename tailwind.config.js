/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#0a0e27',
          darker: '#050812',
          blue: '#1e3a8a',
          purple: '#4c1d95',
        },
        risk: {
          low: '#10b981',
          medium: '#f59e0b',
          high: '#ef4444',
        },
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to bottom, #0a0e27, #1e1b4b, #312e81)',
      },
    },
  },
  plugins: [],
};
