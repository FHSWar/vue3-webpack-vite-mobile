/*
- 插件选项接口(AutoRouterPluginOptions): 定义了插件配置的 TypeScript 接口，以确保类型安全。
- configResolved 钩子: 在 Vite 配置解析完毕后执行，用于初始化路由生成。这里计算出视图目录和路由文件的绝对路径，并定义了生成路由的逻辑。
- generateRoutes 函数: 负责扫描指定目录下的 Vue 文件，并根据文件路径生成路由配置。然后，这些配置被写入到指定的路由配置文件中。
- handleHotUpdate 钩子: 用于处理文件热更新事件。当 Vue 文件被更新时，该钩子会被触发，从而重新生成路由配置文件，确保路由配置实时更新。
- 通过这种方式，你可以自动化地管理 Vue 项目中的路由配置，极大地提升开发效率。
*/
import fs from 'fs'
import path from 'path'
import * as glob from 'glob'
import { type Plugin } from 'vite'

interface AutoRouterPluginOptions {
	viewsDir: string
	routerFile: string
}

function AutoRouterPlugin(
	options: AutoRouterPluginOptions = {
		viewsDir: 'src/modules/demo/views',
		routerFile: 'src/modules/demo/routes.ts'
	}
): Plugin {
	// 返回插件对象
	return {
		name: 'vite-plugin-auto-router',
		enforce: 'pre',
		// 当 Vite 配置解析完毕后执行的钩子
		configResolved(config) {
			// 解析视图目录和路由文件的绝对路径
			const viewsDir = path.resolve(config.root, options.viewsDir)
			console.log('🚀 ~ configResolved ~ viewsDir:', viewsDir)

			const routerFilePath = path.resolve(config.root, options.routerFile)
			console.log('🚀 ~ configResolved ~ routerFilePath:', routerFilePath)

			// 生成路由配置的函数
			const generateRoutes = () => {
				// 使用 glob 匹配 views 目录下的所有 .vue 文件
				const files = glob.sync('**/*.vue', { cwd: viewsDir })
				// 映射文件路径为路由配置
				const routes = files.map((file) => {
					// 去除文件扩展名，用作路由名称
					const name = path.basename(file, '.vue')
					const pagePath = `${path.posix.join(options.viewsDir, file).replace(/\\/g, '/')}`
					const pathPair = `path: '/${name.toLowerCase()}'`
					const namePair = `name: '${name}'`
					const componentPair = `component: () => import('${pagePath.replace('src', '@')}')`

					// 生成路由配置项，懒加载
					return `{\n\t\t${pathPair},\n\t\t${namePair},\n\t\t${componentPair}\n\t}`
				})

				// 生成路由配置文件内容
				const routerConfig = `import { RouteRecordRaw } from 'vue-router'\n\nconst routes: RouteRecordRaw[] = [\n\t${routes.join(',\n\t')}\n]\n\nexport default routes\n`
				// 写入路由配置到文件
				fs.writeFileSync(routerFilePath, routerConfig, 'utf-8')
			}

			// 首次启动时生成路由
			generateRoutes()
		},
		// 处理热更新的钩子
		handleHotUpdate({ file, server }) {
			// 如果更新的是 Vue 文件
			if (file.endsWith('.vue')) {
				const { viewsDir, routerFile } = options
				const viewsDirResolved = path.resolve(server.config.root, viewsDir)
				const routerFilePath = path.resolve(server.config.root, routerFile)
				// 确保更新的文件位于指定的视图目录下
				if (file.startsWith(viewsDirResolved)) {
					const generateRoutes = () => {
						const files = glob.sync('**/*.vue', { cwd: viewsDirResolved })
						const routes = files.map((innerFile) => {
							const name = path.basename(innerFile, '.vue')
							const pagePath = `${path.posix.join(viewsDir, innerFile).replace(/\\/g, '/')}`
							const pathPair = `path: '/${name.toLowerCase()}'`
							const namePair = `name: '${name}'`
							const componentPair = `component: () => import('${pagePath.replace('src', '@')}')`

							return `{\n\t\t${pathPair},\n\t\t${namePair},\n\t\t${componentPair}\n\t}`
						})

						const routerConfig = `import { RouteRecordRaw } from 'vue-router'\n\nconst routes: RouteRecordRaw[] = [\n\t${routes.join(',\n\t')}\n]\n\nexport default routes\n`
						fs.writeFileSync(routerFilePath, routerConfig, 'utf-8')
					}

					// 重新生成路由配置
					generateRoutes()
				}
			}
		}
	}
}

export default AutoRouterPlugin
