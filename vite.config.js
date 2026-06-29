import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(import.meta.url).replace('file://', ''), './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://ctf.techinfo.uz',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'https://ctf.techinfo.uz',
        ws: true,
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://ctf.techinfo.uz',
        changeOrigin: true,
      }
    }
  }
})
