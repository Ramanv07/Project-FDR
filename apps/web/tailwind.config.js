/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ecff',
          200: '#bae0ff',
          300: '#7cc0ff',
          400: '#369dff',
          500: '#097eff',
          600: '#005ed4',
          700: '#004aa6',
          800: '#003a82',
          900: '#00285a',
        },
        navy: {
          50: '#f4f6fb',
          100: '#e5eaf4',
          200: '#cbd5e8',
          300: '#9fb5d5',
          400: '#6c8ebd',
          500: '#486da3',
          600: '#355483',
          700: '#142742',
          800: '#0d1a2d',
          900: '#070f1a',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
        },
        status: {
          green: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
          grey: '#64748b',
          blue: '#0284c7',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        table: ['13px', '18px'],
        base: ['14px', '20px'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(14, 27, 48, 0.08), 0 1px 2px 0 rgba(14, 27, 48, 0.04)',
        'glass-hover': '0 12px 40px 0 rgba(14, 27, 48, 0.12), 0 2px 4px 0 rgba(14, 27, 48, 0.06)',
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'glow-primary': '0 0 20px -2px rgba(9, 126, 255, 0.35)',
        'glow-success': '0 0 20px -2px rgba(16, 185, 129, 0.35)',
      },
      maxWidth: {
        content: '1280px',
      },
      width: {
        sidebar: '240px',
      },
      borderRadius: {
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
};
