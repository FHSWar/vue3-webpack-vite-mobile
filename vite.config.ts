/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: 'terser'
  },
  plugins: [vue()],
  publicDir: './static',
  define: {
    'process.env': {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
      BUILD_TIME: new Date().toLocaleString(),
      VUE_BASE_URL: '/'
    }
  },
  resolve: {
    extensions: ['.vue', '.mjs', '.js', '.cjs', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@': resolve('src')
    }
  }
})
