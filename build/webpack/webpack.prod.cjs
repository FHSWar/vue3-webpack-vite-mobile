const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 压缩CSS插件
const TerserWebpackPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { merge } = require('webpack-merge') // 合并配置文件
const common = require('./webpack.base.cjs')

const plugins = [
  new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash].css',
    chunkFilename: 'css/[name].[contenthash].css'
  })
]

if (process.env.ANALYZE) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: 'localhost',
      reportFilename: 'report.html',
      defaultSizes: 'gzip',
      generateStatsFile: false,
      logLevel: 'info'
    })
  )
}

module.exports = merge(common, {
  optimization: {
    splitChunks: {
      chunks: 'all' // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
    },
    minimizer: [new CssMinimizerPlugin(), new TerserWebpackPlugin()]
  },
  plugins
})
