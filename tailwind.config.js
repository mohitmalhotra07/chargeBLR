/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Emerald green
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          accent: '#00F0A8'
        },
        navy: {
          850: '#0e1629',
          900: '#0A0F1D',
          950: '#060A13',
          card: '#131C31',
          cardBorder: '#1F2C4C',
          light: '#1E293B'
        },
        status: {
          available: '#10B981',
          busy: '#F59E0B',
          broken: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce 2s infinite',
        'charge-wave': 'wave 2s ease-in-out infinite alternate',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateY(0%) scale(1)' },
          '100%': { transform: 'translateY(-4%) scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
