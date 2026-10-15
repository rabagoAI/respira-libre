import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Zona horaria fija para que los tests de fechas no dependan del equipo
    setupFiles: ['./src/test/setup.js'],
  },
})
