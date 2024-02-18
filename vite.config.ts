/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import { VarletUIResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'
import vitePluginEjsMpa from './build/vite/vite-plugin-ejs-mpa'

export default defineConfig({
  base: './',
  build: {
    minify: 'terser'
  },
  plugins: [
    svgLoader(),
    vitePluginEjsMpa(),
    vue(),
    components({
      resolvers: [VarletUIResolver()]
    }),
    autoImport({
      resolvers: [VarletUIResolver({ autoImport: true })]
    })
  ],
  define: {
    'process.env': {
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
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
