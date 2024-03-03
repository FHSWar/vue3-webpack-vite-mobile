/* eslint-disable no-case-declarations */
/*
 * - 插件选项接口(AutoRouterPluginOptions): 定义了插件配置的 TypeScript 接口，以确保类型安全。
 * - configResolved 钩子: 在 Vite 配置解析完毕后执行，用于初始化路由生成。这里计算出视图目录和路由文件的绝对路径，并定义了生成路由的逻辑。
 * - generateRoutes 函数: 负责扫描指定目录下的 Vue 文件，并根据文件路径生成路由配置。这些配置被写入到指定的路由配置文件中。
 * - handleHotUpdate 钩子: 用于处理文件热更新事件。当 Vue 文件被更新时，该钩子会被触发，从而重新生成路由配置文件，确保路由配置实时更新。
 * - 通过这种方式，可以自动化地管理 Vue 项目中的路由配置，极大地提升开发效率。
 */
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { basename, dirname, join, posix, relative, resolve } from 'path'
import { sync } from 'glob'
import { type Plugin } from 'vite'

interface AutoRouterPluginOptions {
	mode: 'spa' | 'mpa' // 新增模式字段，可选值为 'spa' 或 'mpa'
	pagesDir?: string // MPA 模式下，多页面文件夹的路径，默认值是 'pages'
}

// 路由发生变化才写入
function writeIfChanged(routerPath: string, routerConfig: string) {
	let currentConfig = ''
	if (existsSync(routerPath)) {
		currentConfig = readFileSync(routerPath, 'utf-8')
	}

	if (currentConfig !== routerConfig) {
		try {
			writeFileSync(routerPath, routerConfig, 'utf-8')
		} catch (error) {
			console.error(`写入配置文件错误: ${error}`)
		}
	}
}

// 生成路由文件
function generateRoutes(viewsDir: string, routerPath: string) {
	// 使用 glob.sync 匹配 views 目录下的所有 .vue 文件，包括子目录
	const files = sync('**/*.vue', { cwd: viewsDir })

	// 过滤文件列表，只包含根目录下的 Vue 文件和子目录中的 index.vue 文件
	const filteredFiles = files.filter((file) => {
		// 获取文件相对于 views 目录的路径
		const relativePath = relative(viewsDir, join(viewsDir, file))
		// 检查文件是否直接位于 views 目录下，或者是子目录中的 index.vue 文件
		return dirname(relativePath) === '.' || basename(file) === 'index.vue'
	})

	// 映射文件路径为路由配置
	const routes = filteredFiles.map((file) => {
		const fileBaseName = basename(file, '.vue')
		// 拼出键值对
		const routeName =
			fileBaseName === 'index' ? file.split('/')[0] : fileBaseName
		const pathVal = `/${routeName !== 'index' ? routeName : ''}`
		// posix能保证不同系统的路径都是`/`，不会出现windows里面的`\`
		const componentPath = relative(
			process.cwd(),
			posix.join(viewsDir, file).replace(/\\/g, '/')
		).replace('src', '@')

		// 用符合项目eslint规则的换行和缩进拼接起来
		const routeConfig = `{\n\t\tpath: '${pathVal}',\n\t\tname: '${routeName}',\n\t\tcomponent: () => import('${componentPath}')\n\t}`

		return routeConfig
	})

	const importStatement = `import { RouteRecordRaw } from 'vue-router'`
	const routerArray = `const routes: RouteRecordRaw[] = [\n\t${routes.join(',\n\t')}\n]`
	// 拼接生成路由配置文件内容
	const routerConfig = `${importStatement}\n\n${routerArray}\n\nexport default routes\n`

	// 写入路由配置到文件
	try {
		writeIfChanged(routerPath, routerConfig)
	} catch (error) {
		throw new Error(`写入配置文件错误: ${error}`)
	}
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
