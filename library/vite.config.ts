import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import path from 'path'
import fs from 'fs-extra'

export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    {
      name: 'copy-dts-file',
      writeBundle() {
        const dtsPath = path.resolve(__dirname, 'src/index.d.ts');
        const distDtsPath = path.resolve(__dirname, 'dist/types/index.d.ts');
        
        // Copy the .d.ts file to the dist/types directory
        fs.copySync(dtsPath, distDtsPath);
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueOnboardingTour',
      fileName: (format) => `vue-onboarding-tour.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    // Copy index.d.ts into the build output folder
    assetsInlineLimit: 0,  // Ensure non-inline assets get copied
    copyPublicDir: true,   // Ensure public files get copied to build folder
  },
})
