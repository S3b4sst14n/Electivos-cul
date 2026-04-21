/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: {
          DEFAULT: '#1E3A5F',
          light: '#2C5282',
          dark: '#152A45'
        },
        accent: '#F6A623',
        success: '#27AE60',
        warning: '#E67E22',
        danger: '#E74C3C',
        neutral: {
          100: '#F7F8FA',
          200: '#EAECF0',
          300: '#D1D5DB',
          400: '#9CA3AF',
          600: '#6B7280',
          900: '#111827'
        }
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(0,0,0,0.03)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.08)'
      }
    }
  },
  plugins: []
};
