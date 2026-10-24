/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f3f7',
          100: '#d9e0ea',
          200: '#b3c1d5',
          300: '#8da2c0',
          400: '#6783ab',
          500: '#416496',
          600: '#345078',
          700: '#1F3A5F',
          800: '#162a44',
          900: '#0d1a2a',
        },
        surface: {
          50: '#fafaf9',
          100: '#f5f4f2',
          200: '#eceae6',
          300: '#d6d3cd',
        },
        status: {
          green: '#1a7f37',
          amber: '#b35c00',
          red: '#cf222e',
          grey: '#656d76',
        },
      },
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        table: ['13px', '18px'],
        base: ['14px', '20px'],
      },
      maxWidth: {
        content: '1200px',
      },
      width: {
        sidebar: '220px',
      },
      borderRadius: {
        DEFAULT: '4px',
        md: '6px',
      },
    },
  },
  plugins: [],
};
