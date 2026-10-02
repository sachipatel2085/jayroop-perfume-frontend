/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F5D77F',
          DEFAULT: '#D4AF37',
          dark: '#9A7B1C',
          amber: '#F5A623',
          amberDark: '#D97706',
        },
        noir: {
          DEFAULT: '#080808',
          card: '#121215',
          hover: '#1B1B22',
          border: '#27272F',
          subtle: '#3F3F4E',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.15)',
        'gold-glow-lg': '0 0 45px rgba(212, 175, 55, 0.28)',
      },
    },
  },
  plugins: [],
};
