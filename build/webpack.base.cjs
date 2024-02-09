/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const dayjs = require('dayjs')
const HtmlWebpackPlugin = require('html-webpack-plugin') // html插件
const { VueLoaderPlugin } = require('vue-loader/dist/index') // vue-loader 插件, 需配合 @vue/compiler-sfc 一块使用
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  entry: ['./src/index.ts'],
  target: 'web',
  module: {
    rules: [
      // 处理vue
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // 处理字体
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
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
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
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件来施展魔法
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './index.ejs')
    }),
    // 处理静态文件夹 static 复制到打包的 static 文件夹
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, '../static'),
          to: 'static'
        }
      ]
    }),
    // 指定环境,定义环境变量，项目中暂时未用到
    new webpack.DefinePlugin({
      'process.env': {
        VUE_BASE_URL: JSON.stringify('http://localhost:9000'),
        BUILD_TIME: JSON.stringify(dayjs().format('YYYY/DD/MM HH:mm:ss'))
      },
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true)
    }),
    new ForkTsCheckerWebpackPlugin() // 创建一个新进程用于Typescript类型检查
  ],
  resolve: {
    extensions: ['.js', '.cjs', '.vue', '.ts', '.tsx'],
    alias: {
      '@': resolve('src')
    }
  }
}
