/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 压缩CSS插件
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { merge } = require('webpack-merge') // 合并配置文件
const common = require('./webpack.base.cjs')

const plugins = [
  new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash].css',
    chunkFilename: 'css/[name].[contenthash].css'
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8888,
    reportFilename: 'report.html',
    defaultSizes: 'parsed',
    generateStatsFile: false,
    statsFilename: 'stats.json',
    statsOptions: null,
    logLevel: 'info'
  })
]

module.exports = merge(common, {
  optimization: {
    emitOnErrors: true, //  在编译时每当有错误时，就会 emit asset
    // 分离chunks
    splitChunks: {
      chunks: 'all', // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        }
      }
    },
    minimize: false, // 是否压缩
    minimizer: [new CssMinimizerPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        type: 'asset'
      }
    ]
  },
  plugins,
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
    environment: {
      arrowFunction: false,
      destructuring: false
    },
    clean: true
  }
})
