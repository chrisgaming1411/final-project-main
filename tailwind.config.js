/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-white': '#FFFFFF',
        'brand-light-cyan': '#EEFEFF',
        'brand-sky-blue': '#62CFF4',
        'brand-blue': '#2C67F2',
        'brand-dark-navy': '#0B0B45',
        'brand-darker-blue': '#111184',
        'brand-light-gray': '#F5F5F5',
        'brand-teal': '#08637C',
        'brand-cyan-gradient-start': '#009DD1',
        'brand-off-white': '#FFF8F8',
        'brand-gray-text': '#818080',
        'brand-cyan-border': '#06CDF5',
        'brand-purple-start': '#3C1BB3',
        'brand-purple-end': '#000099',
      },
      fontFamily: {
        inter: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #62CFF4, #2C67F2)',
        'gradient-button': 'linear-gradient(to right, #0B0B45, #111184)',
        'gradient-add-button': 'linear-gradient(to right, #3C1BB3, #000099)',
      }
    },
  },
  plugins: [],
}
