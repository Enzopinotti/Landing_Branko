import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

const srcDir = fileURLToPath(new URL('./src/', import.meta.url))

function sourceAliasPlugin(): Plugin {
  return {
    name: 'branko-source-alias',
    enforce: 'pre',
    async resolveId(source, importer) {
      if (!source.startsWith('@/')) return null
      return this.resolve(path.resolve(srcDir, source.slice(2)), importer, { skipSelf: true })
    },
  }
}

export default defineConfig({
  plugins: [sourceAliasPlugin(), react()],
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
        main: fileURLToPath(new URL('index.html', import.meta.url)),
        admin: fileURLToPath(new URL('admin/index.html', import.meta.url)),
      },
    },
  },
})
