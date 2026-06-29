/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0B1020',
          card: '#131C35',
          primary: '#00FF88',
          secondary: '#00D4FF',
          accent: '#7C3AED',
          danger: '#FF4D4D',
          success: '#00FF88',
          text: '#E2E8F0',
          muted: '#64748B'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'Outfit', 'sans-serif']
      },
      boxShadow: {
        'neon-primary': '0 0 10px rgba(0, 255, 136, 0.3), 0 0 20px rgba(0, 255, 136, 0.1)',
        'neon-secondary': '0 0 10px rgba(0, 212, 255, 0.3), 0 0 20px rgba(0, 212, 255, 0.1)',
        'neon-accent': '0 0 10px rgba(124, 58, 237, 0.3), 0 0 20px rgba(124, 58, 237, 0.1)'
      }
    },
  },
  plugins: [],
}
