/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'nuins-blue': '#4E9ABE',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(80vw)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 12s linear infinite',
      },
    },
  },
  plugins: [],
}
