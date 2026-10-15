const { colors, textColor, boxShadowColor, lightVars, darkVars } = require('./theme.colors.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Modo oscuro con la clase `dark` en <html> (ver src/hooks/useTheme.js)
  darkMode: 'class',
  theme: {
    // Paleta con variables CSS para los dos temas (ver theme.colors.cjs)
    colors,
    textColor,
    boxShadowColor,
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    function themeVariables({ addBase }) {
      addBase({
        ':root': { ...lightVars, colorScheme: 'light' },
        'html.dark': { ...darkVars, colorScheme: 'dark' },
        // Zonas que mantienen los colores claros en ambos modos
        'html.dark .theme-fixed': { ...lightVars, colorScheme: 'light' },
      });
    },
  ],
}
