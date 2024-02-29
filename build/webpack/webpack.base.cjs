const { resolve } = require('path')
const Components = require('@nui/unplugin-vue-components/webpack').default
const { PssResolver } = require('@nui/unplugin-vue-components/resolvers')
const dayjs = require('dayjs')
const { loader: extractCssLoader } = require('mini-css-extract-plugin') // 压缩CSS插件
const AutoImport = require('unplugin-auto-import/webpack').default
const { VueLoaderPlugin } = require('vue-loader/dist/index') // vue-loader 插件, 需配合 @vue/compiler-sfc 一块使用
const { DefinePlugin } = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { entry, htmlPlugins } = require('./pages.cjs')

// 用IIFE制作一个缓存函数
const isProd = (() => {
  let cache
  return () => {
    if (cache !== undefined) {
      return cache // 如果已经计算过，直接返回之前的计算结果
    }
    cache = process.env.NODE_ENV === 'production' || process.env.ANALYZE // 计算一次并缓存结果
    return cache
  }
})()
const getMode = () => (isProd() ? 'production' : 'development')
const getStyleLoader = () =>
  isProd() && !process.env.ANALYZE ? extractCssLoader : 'style-loader'

module.exports = {
  mode: getMode(),
  entry,
  target: 'browserslist',
  module: {
    rules: [
      // 处理vue
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        resolve: {
          fullySpecified: false,
          extensions: ['.js', '.mjs', '.cjs', '.vue', '.ts', '.tsx']
        },
        use: [
          {
            loader: 'ts-loader',
            options: {
              // 对应文件添加个.ts或.tsx后缀
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        ]
      },
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [getStyleLoader(), 'css-loader', 'sass-loader', 'postcss-loader']
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024
          }
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    // HtmlWebpackPlugin实例们
    ...htmlPlugins,
    AutoImport({
      resolvers: [PssResolver({ autoImport: true })]
    }),
    Components({
      resolvers: [PssResolver()]
    }),
    // 指定环境,定义环境变量，项目中暂时未用到
    new DefinePlugin({
      'process.env': {
        VUE_BASE_URL: JSON.stringify('http://localhost:9000'),
        BUILD_TIME: JSON.stringify(dayjs().format('YYYY/DD/MM HH:mm:ss'))
      },
      __VUE_OPTIONS_API__: JSON.stringify(false),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
    }),
    new ForkTsCheckerWebpackPlugin(), // 创建一个新进程用于Typescript类型检查
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.js', '.mjs', '.cjs', '.vue', '.ts', '.tsx'],
    alias: {
      '@': resolve('src')
    }
  }
}
