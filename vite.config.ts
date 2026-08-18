import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const resolveFile = (relativePath: string) => fileURLToPath(new URL(relativePath, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@/cms/publicContent', replacement: resolveFile('./src/cms/publicContent.tsx') },
      { find: '@/cms/client', replacement: resolveFile('./src/cms/client.ts') },
      { find: '@/cms/session', replacement: resolveFile('./src/cms/session.ts') },
      { find: '@/cms/types', replacement: resolveFile('./src/cms/types.ts') },
      { find: '@/assets/branko-monogram.svg', replacement: resolveFile('./src/assets/branko-monogram.svg') },
      { find: '@/styles/variables.scss', replacement: resolveFile('./src/styles/variables.scss') },
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
        main: resolveFile('./index.html'),
        admin: resolveFile('./admin/index.html'),
      },
    },
  },
})
