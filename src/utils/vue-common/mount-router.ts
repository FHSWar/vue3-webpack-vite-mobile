import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw
} from 'vue-router'

const mountRouter = (routes: RouteRecordRaw[]) => {
  const router = createRouter({
    history: createWebHashHistory(),
    routes
  })

  router.beforeEach((to, from, next) => {
    // 跳转前逻辑
    next()
  })

  router.afterEach(() => {
    // 跳转后逻辑
  })

  return router
}

export default mountRouter
