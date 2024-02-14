const { accessSync, readdirSync, statSync } = require('fs')
const { join, resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function getTemplatePath(templatePath) {
  const moduleEjsPath = join(templatePath, 'index.ejs')
  const moduleHtmlPath = join(templatePath, 'index.html')

  const paths = [moduleEjsPath, moduleHtmlPath]

  for (let i = 0; i < paths.length; i++) {
    try {
      accessSync(paths[i])
      return paths[i]
    } catch (e) {
      // 为了避免try...catch嵌套，改为for循环，catch不做任何处理
    }
  }

  return resolve(__dirname, '../index.ejs')
}

// 生成HtmlWebpackPlugin实例
function generateHtmlPlugins(modulesDir) {
  const dirs = readdirSync(modulesDir)
  const plugins = dirs
    .map((dir) => {
      const itemPath = join(modulesDir, dir)
      const stat = statSync(itemPath)

      if (stat.isDirectory()) {
        // 当目录存在时，返回一个HtmlWebpackPlugin实例
        return new HtmlWebpackPlugin({
          filename: `${dir}.html`,
          template: getTemplatePath(itemPath),
          chunks: [dir]
        })
      }
      return null
    })
    .filter(Boolean)

  return plugins
}

// 生成入口配置
function generateEntryPoints(modulesDir) {
  const dirs = readdirSync(modulesDir)
  const entry = {}

  dirs.forEach((dir) => {
    const itemPath = join(modulesDir, dir)
    const stat = statSync(itemPath)
    if (stat.isDirectory()) {
      entry[dir] = join(itemPath, 'main.ts')
    }
  })

  return entry
}

const generateHtmlPluginsConfig = () => {
  // 多页面应用的页面目录
  const modulesDir = resolve(__dirname, '../../src/modules')

  const htmlPlugins = generateHtmlPlugins(modulesDir)
  const entry = generateEntryPoints(modulesDir)

  return {
    entry,
    htmlPlugins
  }
}

module.exports = generateHtmlPluginsConfig()
