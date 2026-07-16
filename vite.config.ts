import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: { port: 3000, host: true },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) return 'vendor-three'
            if (id.includes('framer-motion')) return 'vendor-motion'
            if (id.includes('@supabase')) return 'vendor-supabase'
            if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react'
          }
        }
      }
    }
  }
})
