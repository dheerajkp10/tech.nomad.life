import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/tech.nomad.life/',
  build: {
    outDir: '.',
    emptyOutDir: false,
    rollupOptions: {
      input: 'index.html',
    },
  },
})
