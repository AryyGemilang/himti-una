import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/himti-una/',
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/himti-una/api': {
        target: 'http://127.0.0.1:3001',
        rewrite: (path) => path.replace(/^\/himti-una/, ''),
      },
      '/himti-una/media': {
        target: 'http://127.0.0.1:3001',
        rewrite: (path) => path.replace(/^\/himti-una/, ''),
      },
    },
  },
})
