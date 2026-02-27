/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.{tsx,ts,jsx,js,html}",
    "./components/**/*.{tsx,ts,jsx,js}",
  ],
  theme: {
    extend: {
      colors: {
        rccg: {
          green: '#006838',
          blue: '#1B1464',
          red: '#ED1C24',
          gold: '#C5A059',
          cream: '#FAFAF5',
          surface: '#FFFFFF',
        },
        brand: {
          olive: '#5C6B3A',
          cream: '#F9F6F0',
          ink: '#1A1A1A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    }
  },
  plugins: [],
}