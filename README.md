# kde-vue3-webpack-vite-mobile

这是一个使用 Vite 和 Webpack 构建的 Vue 项目模板。它集成了最新的前端开发工具和库（2024/03/01），旨在提供一个快速启动和高效开发的环境。

## 特性

- 使用 Vue 3.x 版本，支持 Composition API。
- 配置了 Vite 和 Webpack，可以根据需要选择不同的构建工具。
- 集成 TypeScript，提供静态类型检查。
- 使用 ESLint 和 Stylelint 进行代码和样式的规范检查。
- 使用 Prettier 进行代码格式化。
- 支持 CSS 预处理器和 PostCSS。
- 集成 Tailwind CSS，提供实用的工具类。
- 支持自动导入 Vue 组件和 API。
- 配置了 Husky 和 lint-staged，自动化 Git 提交前的代码和样式检查。

## 脚本命令

- `npm run anls`：分析打包大小。
- `npm run dev`：使用 Vite 启动开发服务器。
- `npm run dev:webpack`：使用 Webpack 启动开发服务器。
- `npm run build`：使用 Webpack 构建生产环境代码。
- `npm run build:vite`：使用 Vite 构建生产环境代码。
- `npm run lint`：ESLint 检查 TypeScript 和 Vue 文件。
- `npm run lintcss`：Stylelint 检查 CSS/SCSS/Vue 文件中的样式。
- `npm run precommit`：提交前运行的脚本，通过 lint-staged 指定。
- `npm run prepare`：安装 Husky Git 钩子。
- `npm run preview`：预览生产环境构建。

## 如何使用

克隆仓库后，在`node18`（或以上）运行 `pnpm install` 安装依赖，然后使用上述脚本命令根据需求启动开发服务器或构建项目。

## 目录说明

```shell
.
├── README.md                   # 项目的说明文档，介绍项目信息、使用方法等。
├── auto-imports.d.ts           # 自动生成的类型声明文件，通常用于支持 Vite 插件自动导入的功能。
├── babel.config.cjs            # Babel 配置文件，定义了 JavaScript 代码转换的规则。
├── build                       # 包含构建配置文件的目录。
│   ├── index.ejs               # EJS 模板文件，通常用作 HTML 页面的模板。
│   ├── vite                    # 存放 Vite 特定构建配置的目录。
│   │   └── vite-plugin-ejs-mpa.ts  # 自定义的 Vite 插件，用于支持多页面应用（MPA）。
│   └── webpack                 # 存放 Webpack 特定构建配置的目录。
│       ├── pages.cjs           # 定义 Webpack 构建的多页面入口配置。
│       ├── webpack.base.cjs    # Webpack 的基础配置文件。
│       ├── webpack.dev.cjs     # Webpack 的开发环境配置文件。
│       └── webpack.prod.cjs    # Webpack 的生产环境配置文件。
├── components.d.ts             # Vue 组件的类型声明文件。
├── package.json                # 定义项目的元数据和依赖关系。
├── pnpm-lock.yaml              # pnpm 包管理器生成的锁文件，确保依赖版本的一致性。
├── postcss.config.cjs          # PostCSS 配置文件，用于处理 CSS 的转换和优化。
├── public                      # 存放公共静态资源的目录。
│   └── head.json               # 示例静态数据文件。
├── src                         # 项目的源代码目录。
│   ├── apis                    # 存放 API 请求相关代码的目录。
│   ├── assets                  # 存放静态资源文件，如图片和样式。
│   ├── components              # Vue 公用组件目录。
│   ├── composables             # 存放 Vue 组合式函数相关逻辑的目录。
│   ├── main.scss               # 主样式文件，全局样式定义。
│   ├── modules                 # 项目模块/页面级组件的目录。
│   │   └── demo                # 示例模块目录，可能包含特定模块的 Vue 组件、状态管理等。
│   │       ├── App.vue         # 模块的根组件。
│   │       ├── main.ts         # 模块的入口文件。
│   │       ├── router.ts       # 模块的 Vue Router 配置。
│   │       ├── shims-vue.d.ts  # Vue 文件的 TypeScript 声明文件。
│   │       └── store.ts        # 模块的 Vuex 状态管理配置。
│   └── utils                   # 存放工具函数和帮助方法的目录。
│       └── calc-root-font-size.ts # 计算根字号，适配px-to-rem。
├── tailwind.config.cjs         # Tailwind CSS 配置文件。
├── tsconfig.json               # TypeScript 配置文件，定义了 TS 编译的规则和选项。
└── vite.config.ts              # Vite 配置文件，定义了项目构建和开发服务器的设置。
```

## 依赖项说明

### dependencies（生产依赖）

- `Neat-UI`: 这是平安寿险口袋E产品开发团队开发的基于 Vue 3 的移动端组件库。
- `axios`: 基于 promise 的 HTTP 客户端，用于浏览器和 node.js。
- `core-js`: 为旧环境提供现代 JavaScript 的 polyfill，帮助支持 ES6+ 特性。
- `reset-css`: 重置浏览器的 CSS 样式，提供一致的跨浏览器外观。
- `vue`: Vue.js 框架的核心库，用于构建用户界面。
- `vue-router`: Vue.js 的官方路由管理器。
- `pinia`: Vue 3 的状态管理模式+库。

### devDependencies（开发依赖）

- `@babel/*`: 一系列 Babel 工具和预设，用于将 ES6+ 代码转换为向后兼容的 JavaScript 代码。
- `@rollup/plugin-terser`: Rollup 插件，用于压缩输出的 JavaScript 文件。
- `@soda/friendly-errors-webpack-plugin`: 用于 Webpack，美化错误信息，提高开发体验。
- `@types/*`: TypeScript 类型定义文件，用于为 JavaScript 库提供类型检查。
- `@typescript-eslint/*`: 一套 ESLint 规则，专为 TypeScript 代码量身定做。
- `@vitejs/plugin-vue`: Vite 插件，支持 Vue 3 单文件组件。
- `autoprefixer`: PostCSS 插件，自动添加浏览器前缀以兼容不同浏览器。
- `babel-loader`: Webpack 的 loader，用于转译 JavaScript 文件。
- `css-loader` 和 `style-loader`: Webpack 的 loader，用于处理 CSS 文件。
- `eslint` 和相关插件: 用于静态代码检查，确保代码质量和风格一致性。
- `husky` 和 `lint-staged`: 工具，用于在 git 提交前自动运行 linters。
- `mini-css-extract-plugin`: 从 JavaScript 文件中提取 CSS 到单独的文件。
- `postcss` 和相关插件: 工具，用于转换 CSS 代码，如添加浏览器前缀、使用未来 CSS 特性等。
- `prettier`: 代码格式化工具，确保代码风格一致。
- `sass` 和 `sass-loader`: CSS 预处理器和对应的 Webpack loader，用于处理 SASS/SCSS 文件。
- `stylelint` 和相关配置: 用于检查 CSS/SCSS 代码的工具。
- `terser-webpack-plugin`: 用于压缩 JavaScript 的 Webpack 插件。
- `typescript`: TypeScript 是 JavaScript 的一个超集，添加了静态类型检查。
- `unplugin-*`: Vite/Webpack 插件，自动导入 Vue 组件、APIs 等。
- `vite`: 构建工具，提供快速的开发服务器和优化的生产构建。
- `webpack`, `webpack-cli`, `webpack-dev-server`, `webpack-merge`: Webpack 及其命令行工具、开发服务器和合并配置的工具。

## 贡献

如果你有任何改进建议或想要贡献代码，请随时提交 Pull Request 或开 Issue。

## 许可证

本项目采用 MIT 许可证。
