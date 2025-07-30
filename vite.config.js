import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        pensionstal: resolve(__dirname, 'pensionstal.html'),
        rijlessen: resolve(__dirname, 'rijlessen.html'),
        'trauma-recovery': resolve(__dirname, 'trauma-recovery.html'),
        'pivo-lessen': resolve(__dirname, 'pivo-lessen.html'),
        'ter-dekking': resolve(__dirname, 'ter-dekking.html')
      },
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Increase asset size limit for images
    assetsInlineLimit: 0 // Don't inline any assets to keep file paths predictable
  },
  
  // Asset handling
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp'],
  
  // CSS configuration
  css: {
    devSourcemap: false
  },
  
  // Public directory
  publicDir: 'public'
})