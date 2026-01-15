/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        background: '#22223b',
        primary: '#c9ada7',
        textLight: '#f2e9e4',
        accent: {
          DEFAULT: '#9a8c98',
          light: '#9a8c98',
          dark: '#4a4e69',
        },
        // Legacy slate colors (for backward compatibility)
        slate: {
          850: '#22223b',
          900: '#22223b',
          950: '#1a1a2e',
          800: '#4a4e69',
          700: '#9a8c98',
          600: '#9a8c98',
          500: '#9a8c98',
          400: '#c9ada7',
          300: '#d9bdb7',
          200: '#e2d9d4',
          100: '#f2e9e4',
          50: '#f2e9e4',
        },
        // Legacy amber colors mapped to primary
        amber: {
          400: '#c9ada7',
          500: '#c9ada7',
          600: '#b89a94',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'monospace'],
      }
    }
  }
}
