/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': '#FFFFFF',
        'secondary': '#080808',
        'accent': '#2EB143',
        'accent-2': '#DCF2DF',
        'accent-3': '#D5E9FE',
        'accent-4': '#0F3B16',
        'accent-error': '#FADADA',
        'accent-wait': '#FFF3E6',
        'secondary-gray': '#636363',
        'inactive-gray': '#A7ABB6',
        'inactive-gray-2': '#DFDFDF',
        'hover-green': '#1E762C',

        'selesai': '#73CB81',
        'berlangsung': '#58A6FB',
        'menunggu': '#FFA033',
        'ditolak': '#EA6A6A',
      },
    },
  },
  plugins: [],
}

