import { type RouteRecordRaw } from 'vue-router'
import HomeView from './views/home-view.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'start-page',
    redirect: 'home-view'
  },
  {
    name: '',
    path: '/home-view',
    component: HomeView
  }
]

export default routes
