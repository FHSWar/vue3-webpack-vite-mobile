module.exports = {
  presets: [
    [
      '@babel/preset-env'
      /* 按需垫片仍然导致构建体积大增，所以暂时关闭
      {
        useBuiltIns: 'usage', // 按需引入 polyfill
        corejs: 3,
      }, */
    ],
    [
      '@babel/preset-typescript', // 引用Typescript插件
      {
        allExtensions: true // 支持所有文件扩展名，否则在vue文件中使用ts会报错
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3
      }
    ]
  ]
}
