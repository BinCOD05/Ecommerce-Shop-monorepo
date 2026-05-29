/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Exo 2"', 'sans-serif'],
        body:    ['Nunito', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        // Legacy compat
        Bebas:   ['"Exo 2"', 'sans-serif'],
        Roboto:  ['Nunito', 'sans-serif'],
      },
      colors: {
        accent: '#00D2A8',
        price:  '#F59E0B',
      },
      scale: {
        '108': '1.08',
      },
      boxShadow: {
        'glow':    '0 0 24px rgba(0,210,168,0.3)',
        'glow-lg': '0 0 48px rgba(0,210,168,0.5)',
      },
    },
  },
  plugins: [],
}
