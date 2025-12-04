import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [react(), tailwindcss()],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/lib-entry.ts'),
          name: 'StackloopUI',
          formats: ['es', 'cjs'],
          fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime', 'framer-motion', 'lucide-react'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'react/jsx-runtime',
              'framer-motion': 'framerMotion',
              'lucide-react': 'LucideReact'
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'style.css') return 'theme.css'
              return assetInfo.name || ''
            }
          }
        },
        cssCodeSplit: false,
        sourcemap: true,
        emptyOutDir: false
      }
    }
  }

  return {
    plugins: [react(), tailwindcss()],
  }
})
