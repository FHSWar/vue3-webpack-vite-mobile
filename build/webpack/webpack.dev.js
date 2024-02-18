const { resolve } = require('path')
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin')
const { merge } = require('webpack-merge')
const common = require('./webpack.base.js')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  cache: {
    type: 'filesystem'
  },
  devServer: {
    port: 5173,
    static: {
      directory: resolve(process.cwd(), 'public'),
      watch: true
    },
    host: '0.0.0.0',
    compress: true // 为每个静态文件开启 gzip compression
  },
  plugins: [new FriendlyErrorsWebpackPlugin()]
})
