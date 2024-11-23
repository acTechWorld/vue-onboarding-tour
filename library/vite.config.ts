import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias '@' to your src directory
    },
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs
        drop_debugger: true,
      },
    },
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'), // Adjust path to index.js if needed
      name: 'VueOnboardingTour',
      fileName: (format) => `vue-onboarding-tour.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // Ensure external dependencies are not bundled into your library
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
