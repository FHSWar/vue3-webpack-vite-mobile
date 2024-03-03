import 'reset-css'
import { createPinia } from 'pinia'
import { createApp } from 'vue' // Vue 3.x 引入 vue 的形式
import { vSafeHtml } from '@/directives' // 按需打包的防xss指令
import '@/main.css'
import {
	calRootFontSize, // 引入计算根字体大小的模块
	checkWebp,
	mountRouter // 挂载路由，返回路由对象
} from '@/utils'
import routes from './routes'
import App from './app.vue' // 引入 APP 页面组建

const app = createApp(App) // 通过 createApp 初始化 app
const pinia = createPinia()
const router = mountRouter(routes)

app.use(router).use(pinia).directive('safe-html', vSafeHtml).mount('#app') // 将页面挂载到root节点
calRootFontSize(document, window)
checkWebp()
