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
    textShadow: {
      sm: '0 1px 2px var(--tw-shadow-color)',
      DEFAULT: '0 2px 4px var(--tw-shadow-color)',
      lg: '0 8px 16px var(--tw-shadow-color)',
      light: '0 1px 3px rgba(255, 255, 255, 0.8)', // 흰색에 투명도 0.8
      md_light: '0 2px 5px rgba(255, 255, 255, 0.7)', // 조금 더 번지는 밝은 그림자
      outline: '1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white',
      outline_lg: '2px 2px 0px white, -2px -2px 0px white, 2px -2px 0px white, -2px 2px 0px white',
    },
  },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          'text-shadow': '0px 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-md': {
          'text-shadow': '0px 4px 6px rgba(0, 0, 0, 0.6)',
        },
        '.text-shadow-light': {
          'text-shadow': '0px 1px 3px rgba(255, 255, 255, 0.8)',
        },
        '.text-shadow-md-light': {
          'text-shadow': '0px 2px 5px rgba(255, 255, 255, 1.5)',
        },
        '.text-outline': {
          'text-shadow': '1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white',
          // -webkit-text-stroke-width: 1px; // 웹킷 브라우저 지원을 위한 주석 처리된 예시
          // -webkit-text-stroke-color: white; // 웹킷 브라우저 지원을 위한 주석 처리된 예시
        },
        '.text-outline-lg': {
          'text-shadow': '2px 2px 0px white, -2px -2px 0px white, 2px -2px 0px white, -2px 2px 0px white',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
}
