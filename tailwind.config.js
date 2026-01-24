/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        quiz: {
          primary: '#6366f1',
          secondary: '#a855f7',
          accent: '#06b6d4',
          bg: '#f8fafc',
          dark: '#0f172a',
          light: {
            bg: '#f8fafc',
            primary: '#4f46e5',
            dark: '#1e293b',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      }
    },
  },
  plugins: [],
}
