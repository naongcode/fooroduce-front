/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        truckMove: {
          '0%': {
            transform: 'translateX(-100px)',
          },
          '100%': {
            transform: 'translateX(100px)',
          },
        },
      },
    },
  },
  plugins: [],
}
