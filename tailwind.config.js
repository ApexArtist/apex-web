/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#080c14',
        surface: '#0e1520',
        card: '#111826',
        border: '#131c2e',
        blue: '#4a8aff',
        'blue-dim': '#1e2a44',
        'blue-glow': '#6ba0ff',
        muted: '#3a4a6a',
        text: '#f4f7fc',
        'text-dim': '#8a9ab8',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
