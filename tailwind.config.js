/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#047857',
          700: '#065f46',
          800: '#064e3b',
          900: '#1a4d2e',
          950: '#0f2818',
        },
        canopy: {
          50: '#fcfdfa',
          100: '#f5f9ed',
          200: '#eef4df',
          300: '#e8f2d8',
          400: '#d4dfc4',
          500: '#bfd0a7',
          600: '#a8b88e',
          700: '#8a9b73',
          800: '#6d7d5a',
          900: '#546248',
        },
      },
      backgroundImage: {
        'forest': "url('/forest-texture.jpg')",
      },
    },
  },
  plugins: [],
};
