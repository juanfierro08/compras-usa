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
        // Azul noche profundo (#0F1B2D) como color principal de marca
        navy: {
          950: '#070D17',
          900: '#0F1B2D', // Color principal de marca
          850: '#142238',
          800: '#1A2C46',
          700: '#253E61',
          DEFAULT: '#0F1B2D',
        },
        // Colores de categoría para bloques sin foto
        graphite: '#2A2D34',
        sage: '#7C8F7A',
        burgundy: '#5E2A35',
        // Crema cálido de base (#FAF7F2)
        cream: {
          50: '#FDFBF7',
          DEFAULT: '#FAF7F2',
          100: '#F6F2EC',
          200: '#EDE7DC',
          300: '#E2DACB',
        },
        // Negro carbón para textos y acentos oscuros
        carbon: {
          DEFAULT: '#161616',
          muted: '#333333',
          light: '#555555',
          border: '#282828'
        },
        // Dorado champán apagado (#B08D57) como acento refinado
        champagne: {
          light: '#D4AF37',
          DEFAULT: '#B08D57',
          dark: '#8E6E38',
          subtle: '#F4ECE1'
        },
        // Arena y divisores finos de 1px
        sand: {
          DEFAULT: '#E5DFD7',
          light: '#EFECE6',
          dark: '#D3CAC0'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.22em',
        'subtle': '0.08em'
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(15, 27, 45, 0.04)',
        'lifted': '0 10px 30px rgba(15, 27, 45, 0.08)',
      }
    },
  },
  plugins: [],
}
