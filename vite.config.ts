/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'
import vitePluginAutoRouter from './build/vite/vite-plugin-auto-router'
import vitePluginEjsMpa from './build/vite/vite-plugin-ejs-mpa'

export default defineConfig({
	base: './',
	build: {
		minify: 'terser'
	},
	plugins: [
		svgLoader(),
		vitePluginAutoRouter({
			mode: 'mpa',
			pagesDir: 'modules'
		}),
		vitePluginEjsMpa(),
		vue()
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
	server: {
		host: '0.0.0.0'
	},
	resolve: {
		extensions: ['.vue', '.mjs', '.js', '.cjs', '.ts', '.jsx', '.tsx', '.json'],
		alias: {
			'@': resolve('src')
		}
	}
})
