import { createApp } from 'vue' // Vue 3.x 引入 vue 的形式
import App from './App.vue' // 引入 APP 页面组建
// import router from './router'
import store from './store'
import calRootFontSize from '@/utils/calc-root-font-size' // 引入计算根字体大小的模块
import '@/main.css' // 引入tailwind全局样式

const app = createApp(App) // 通过 createApp 初始化 app
app.use(store).mount('#app') // 将页面挂载到 root 节点 // .use(router)

calRootFontSize(document, window) // 调用计算根字体大小的方法
