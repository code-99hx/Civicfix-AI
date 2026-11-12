/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        md: '0.375rem', // standardizing rounded-md everywhere per instructions
      },
      colors: {
        civic: {
          dark: '#0d0d0f',
          surface: '#151518',
          card: '#1c1c20',
          border: 'rgba(255, 255, 255, 0.08)',
          borderLight: '#e7e5e4',
          subtle: '#8f9098',
          lightBg: '#fcfbf9',
          lightCard: '#ffffff',
          coral: '#ff6243',
          peach: '#ff7e5f',
          pink: '#ff4b72',
          amber: '#fca311',
          gold: '#f9c74f',
        }
      },
      backgroundImage: {
        'warm-hero': 'radial-gradient(ellipse at 70% 30%, #ff6b4a 0%, #ff4b72 35%, #eb3b5a 60%, #b82544 100%)',
        'subtle-glow': 'radial-gradient(circle at 50% 50%, rgba(255, 107, 74, 0.15) 0%, transparent 70%)',
      }
    },
  },
  plugins: [],
}
