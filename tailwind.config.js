/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          DEFAULT: '#FAF7F2',
          100: '#F6F2EC',
          200: '#EDE7DC',
          300: '#E2DACB',
        },
        carbon: {
          DEFAULT: '#161616',
          muted: '#404040',
          light: '#666666',
          border: '#282828'
        },
        champagne: {
          light: '#D4AF37',
          DEFAULT: '#B08D57',
          dark: '#8E6E38',
          subtle: '#F4ECE1'
        },
        sand: {
          DEFAULT: '#E5DFD7',
          light: '#EFECE6',
          dark: '#D3CAC0'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.22em',
        'subtle': '0.08em'
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'lifted': '0 10px 30px rgba(22, 22, 22, 0.05)',
      }
    },
  },
  plugins: [],
}
