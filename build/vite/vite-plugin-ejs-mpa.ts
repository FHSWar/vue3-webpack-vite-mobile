/*
 * 这个函数用于将 EJS 模板渲染为 HTML 文件。
 * 它首先检查输出路径下是否已经存在同名的 HTML 文件。
 * 如果存在，函数将输出一个警告并立即返回，不再执行后续的操作。
 * 如果不存在，函数将读取 EJS 模板文件，然后使用 EJS 渲染模板，
 * 并将渲染结果写入到输出路径下的 HTML 文件中，作为vite多页面项目的html入口，行为与webpack一致。
 */
import {
  access,
  mkdir,
  readdir,
  readFile,
  unlink,
  writeFile
} from 'fs/promises'
import { join, resolve } from 'path'
import { render } from 'ejs'
import { PluginOption } from 'vite'

const resolveCwd = (p: string) => resolve(process.cwd(), p)

// 默认的 EJS 模板路径
const fallbackEjsPath = resolveCwd('build/index.ejs')
const tempFiles: string[] = []

// 获取 EJS 模板路径的函数
async function getEjsTemplatePath(moduleName: string) {
  const ejsFilePath = resolveCwd(`src/modules/${moduleName}/index.ejs`)

  try {
    await access(ejsFilePath)
    return ejsFilePath
  } catch {
    return fallbackEjsPath
  }
}

async function renderEjsToHtml(
  ejsPath: string,
  outputDir: string,
  moduleName: string
): Promise<string | null> {
  const outputPath = join(outputDir, `${moduleName}.html`)

  // 检查文件是否存在
  try {
    await access(outputPath)
    console.warn(`文件 ${outputPath} 已存在，跳过...`)
    return null
  } catch (err) {
    // 文件不存在，继续执行
  }

  const template = await readFile(ejsPath, 'utf-8')
  const srcPath = resolveCwd(`src/modules/${moduleName}/main.ts`)
  const entryScriptTag = `<script type="module" src="${srcPath}"></script>`
  const htmlContent = render(template, {
    VITE_ENTRY_SCRIPT: entryScriptTag
  })

  tempFiles.push(outputPath)
  await writeFile(outputPath, htmlContent)

  return outputPath
}

// 删除临时文件
function cleanupTempFiles() {
  Promise.all(tempFiles.map((file) => unlink(file)))
    .then(() => console.log('Temporary files removed.'))
    .catch((err) => console.error('Error removing temporary files:', err))
}

// 处理正常退出
process.on('exit', cleanupTempFiles)

// 处理Ctrl+C
process.on('SIGINT', () => {
  cleanupTempFiles()
  process.exit()
})

export default function vitePluginEjsMpa(): PluginOption {
  return {
    name: 'vite-plugin-ejs',
    enforce: 'pre',
    async config() {
      const modulesDir = resolveCwd(`src/modules`)
      const modules = await readdir(modulesDir)
      const tempOutputDir = resolveCwd('')

      // 确保临时输出目录存在
      await mkdir(tempOutputDir, { recursive: true })

      // 为每个模块的EJS文件渲染HTML并收集输入配置
      const input = Object.fromEntries(
        await Promise.all(
          modules.map(async (module) => {
            const ejsTemplatePath = await getEjsTemplatePath(module)
            const htmlPath = await renderEjsToHtml(
              ejsTemplatePath,
              tempOutputDir,
              module
            )
            return [module, htmlPath]
          })
        )
      )

      return {
        build: {
          rollupOptions: {
            input
          }
        }
      }
    }
  }
}
