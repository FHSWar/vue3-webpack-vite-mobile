module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
    commonjs: true
  },
  // plugin:prettier/recommended：使用prettier中的样式规范，且如果使得ESLint会检测prettier的格式问题，同样将格式问题以error的形式抛出
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-console': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off'
  },
  overrides: [
    // webpack配置文件遵循commonjs规范,所以关闭禁止require规则
    {
      files: ['*.cjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    // 有些依赖不体现在打包产物中，但需要import，所以关闭import规则
    {
      files: ['*.cjs', 'vite.config.ts'],
      rules: {
        'import/no-extraneous-dependencies': 'off'
      }
    },
    // .d.ts是自动生成的，不做校验
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off'
      }
    }
  ]
}
