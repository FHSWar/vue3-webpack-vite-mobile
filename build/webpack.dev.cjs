/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge')
const path = require('path')
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin')
const common = require('./webpack.base.cjs')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  cache: {
    type: 'filesystem'
  },
  devServer: {
    port: 8080,
    static: '../dist',
    host: '0.0.0.0',
    compress: true // 为每个静态文件开启 gzip compression
  },
  output: {
    filename: 'js/[name].[hash].js',
    path: path.resolve(__dirname, '../dist')
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
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          // 'postcss-loader',
          'less-loader'
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
