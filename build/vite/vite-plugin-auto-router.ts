/* eslint-disable no-case-declarations */
/*
 * - 插件选项接口(AutoRouterPluginOptions): 定义了插件配置的 TypeScript 接口，以确保类型安全。
 * - configResolved 钩子: 在 Vite 配置解析完毕后执行，用于初始化路由生成。这里计算出视图目录和路由文件的绝对路径，并定义了生成路由的逻辑。
 * - generateRoutes 函数: 负责扫描指定目录下的 Vue 文件，并根据文件路径生成路由配置。这些配置被写入到指定的路由配置文件中。
 * - handleHotUpdate 钩子: 用于处理文件热更新事件。当 Vue 文件被更新时，该钩子会被触发，从而重新生成路由配置文件，确保路由配置实时更新。
 * - 通过这种方式，可以自动化地管理 Vue 项目中的路由配置，极大地提升开发效率。
 */
import { constants, promises } from 'fs'
import { basename, dirname, join, posix, relative, resolve } from 'path'
import { sync } from 'glob'
import { Plugin } from 'vite'

const { readFile, writeFile, access } = promises
// F_OK 用于检查文件的存在性，而不关心访问权限的其他方面，如读写权限
const { F_OK } = constants

interface AutoRouterPluginOptions {
	mode: 'spa' | 'mpa' // 新增模式字段，可选值为 'spa' 或 'mpa'
	pagesDir?: string // MPA 模式下，多页面文件夹的路径，默认值是 'pages'
}

// 路由发生变化才写入
function writeIfChanged(routerPath: string, routerConfig: string) {
	access(routerPath, F_OK)
		.then(() => readFile(routerPath, 'utf-8'))
		.then((currentConfig) => {
			if (currentConfig !== routerConfig) {
				writeFile(routerPath, routerConfig, 'utf-8')
			}
		})
		.catch((error) => {
			if (error.code === 'ENOENT') {
				// 文件不存在，直接写入
				writeFile(routerPath, routerConfig, 'utf-8')
			} else console.error(`写入配置文件错误: ${error}`)
		})
}

// 生成路由文件
function generateRoutes(viewsDir: string, routerPath: string) {
	const filteredFiles = sync('**/*.vue', { cwd: viewsDir }).filter((file) => {
		const relativePath = relative(viewsDir, join(viewsDir, file))
		return dirname(relativePath) === '.' || basename(file) === 'index.vue'
	})

	const routes = filteredFiles.map((file) => {
		const fileBaseName = basename(file, '.vue')
		const routeName =
			fileBaseName === 'index' ? file.split('/')[0] : fileBaseName
		const pathVal = `/${routeName !== 'index' ? routeName : ''}`
		const componentPath = relative(
			process.cwd(),
			// 将所有反斜杠（\）转换为正斜杠（/），进一步确保路径的跨平台兼容性
			posix.join(viewsDir, file).replace(/\\/g, '/')
			// src还要考虑相对路径，不如`@`方便
		).replace('src', '@')
		return `{\n\t\tpath: '${pathVal}',\n\t\tname: '${routeName}',\n\t\tcomponent: () => import('${componentPath}')\n\t}`
	})

	const importStatement = `import { RouteRecordRaw } from 'vue-router'`
	const routerArray = `const routes: RouteRecordRaw[] = [\n\t${routes.join(',\n\t')}\n]`
	const routerConfig = `${importStatement}\n\n${routerArray}\n\nexport default routes\n`

	writeIfChanged(routerPath, routerConfig)
}

function vitePluginAutoRouter(options: AutoRouterPluginOptions): Plugin {
	return {
		name: 'vite-plugin-auto-router',
		enforce: 'pre',
		configResolved(config) {
			switch (options.mode) {
				// MPA 模式下的处理逻辑
				case 'mpa':
					const pagesDir = options.pagesDir
						? resolve(config.root, 'src', options.pagesDir)
						: ''

					sync('*/', { cwd: pagesDir }).forEach((page) => {
						const pageViewsDir = join(pagesDir, page, 'views')
						const pagerouterPath = join(pagesDir, page, 'routes.ts')
						generateRoutes(pageViewsDir, pagerouterPath)
					})
					break
				// SPA 模式下的处理逻辑
				case 'spa':
					const resolvedViewsDir = resolve(config.root, 'src/views')
					const resolvedrouterPath = resolve(config.root, 'src/routes.ts')
					generateRoutes(resolvedViewsDir, resolvedrouterPath)
					break
				default:
					throw new Error('不存在的模式')
			}
		},
		handleHotUpdate({ file, server }) {
			if (file.endsWith('.vue')) {
				const serverRoot = server.config.root
				// mpa默认文件夹为pages，spa没有中间文件夹
				const pagesDirName =
					options.mode === 'mpa' ? options.pagesDir || 'pages' : ''
				const pageDir = resolve(server.config.root, 'src', pagesDirName)
				const pathArr = relative(pageDir, file).split('/')
				// spa模式下pathArr.length === 1，不存在activePage，因此给空字符串
				const activePage = pathArr.length === 1 ? '' : pathArr[0]

				const viewsDirResolved = resolve(
					serverRoot,
					'src',
					pagesDirName,
					activePage,
					'views'
				)
				const routerPath = resolve(
					serverRoot,
					'src',
					pagesDirName,
					activePage,
					'routes.ts'
				)

				if (file.startsWith(viewsDirResolved)) {
					generateRoutes(viewsDirResolved, routerPath)
				}
			}
		}
	}
}

export default vitePluginAutoRouter
