import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const cmsDir = fileURLToPath(new URL('./src/cms/', import.meta.url))
const assetsDir = fileURLToPath(new URL('./src/assets/', import.meta.url))
const stylesDir = fileURLToPath(new URL('./src/styles/', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@\/cms\/(.+)$/, replacement: `${cmsDir}$1` },
      { find: /^@\/assets\/(.+)$/, replacement: `${assetsDir}$1` },
      { find: /^@\/styles\/(.+)$/, replacement: `${stylesDir}$1` },
    ],
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
        main: fileURLToPath(new URL('index.html', import.meta.url)),
        admin: fileURLToPath(new URL('admin/index.html', import.meta.url)),
      },
    },
  },
})
