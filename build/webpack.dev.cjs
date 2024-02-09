/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path')
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin')
const { merge } = require('webpack-merge')
const common = require('./webpack.base.cjs')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  cache: {
    type: 'filesystem'
  },
  devServer: {
    port: 5173,
    static: {
      directory: resolve(__dirname, '../public'),
      watch: true
    },
    host: '0.0.0.0',
    compress: true // 为每个静态文件开启 gzip compression
  },
  output: {
    filename: 'js/[name].[hash].js',
    path: resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          // 'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif|cur)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [new FriendlyErrorsWebpackPlugin()],
  mode: 'development'
})
