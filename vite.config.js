import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000,
    proxy: {
      // this forwards API requests during local dev to your backend
      '/api': 'http://localhost:5000'
    }
  }
})
