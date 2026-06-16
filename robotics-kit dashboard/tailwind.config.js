/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#050B14',
        'surface-container': '#0A1322',
        primary: '#00F0FF',
        'primary-light': '#66FAFF',
        accent: '#7000FF',
        secondary: '#00FF9D',
        'on-surface': '#F0F8FF',
        'on-surface-variant': '#8CA5C0'
      },
      fontFamily: {
        headline: ['Inter', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
        label: ['Outfit', 'sans-serif']
      }
    },
  },
  plugins: [],
}
