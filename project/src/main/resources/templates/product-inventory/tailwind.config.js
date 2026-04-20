/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3',
          300: '#fda4af', 400: '#fb7185', 500: '#f43f5e',
          600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337',
        },
        blush: {
          50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe',
          300: '#f0abfc', 400: '#e879f9', 500: '#d946ef',
          600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75',
        }
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['Trebuchet MS', 'Helvetica', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      }
    }
  },
  plugins: [],
}
