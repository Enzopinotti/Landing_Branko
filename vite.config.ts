import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, pathToFileURL, URL } from 'node:url'

const resolveFile = (relativePath: string) => fileURLToPath(new URL(relativePath, import.meta.url))

const sourceImports = new Map([
  ['@/cms/publicContent', resolveFile('./src/cms/publicContent.tsx')],
  ['@/cms/client', resolveFile('./src/cms/client.ts')],
  ['@/cms/session', resolveFile('./src/cms/session.ts')],
  ['@/cms/types', resolveFile('./src/cms/types.ts')],
  ['@/assets/branko-monogram.svg', resolveFile('./src/assets/branko-monogram.svg')],
])

function rewriteSourceImports(): Plugin {
  return {
    name: 'branko-rewrite-source-imports',
    enforce: 'pre',
    transform(code, id) {
      if (!/\.[cm]?[jt]sx?$/.test(id)) return null
      let next = code
      sourceImports.forEach((replacement, source) => {
        next = next.replaceAll(`'${source}'`, `'${replacement}'`)
        next = next.replaceAll(`"${source}"`, `"${replacement}"`)
      })
      return next === code ? null : { code: next, map: null }
    },
  }
}

export default defineConfig({
  plugins: [rewriteSourceImports(), react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        importers: [
          {
            findFileUrl(url: string) {
              if (url === '@/styles/variables.scss') {
                return pathToFileURL(resolveFile('./src/styles/variables.scss'))
              }
              return null
            },
          },
        ],
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
