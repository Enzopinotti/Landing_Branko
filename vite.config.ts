import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const resolveFile = (relativePath: string) => fileURLToPath(new URL(relativePath, import.meta.url))
const srcDir = resolveFile('./src')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolveFile('./index.html'),
        admin: resolveFile('./admin/index.html'),
      },
    },
  },
})
