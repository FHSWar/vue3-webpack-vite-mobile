import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
	{
		path: '/home-view',
		name: 'home-view',
		component: () => import('@/modules/demo/views/home-view.vue')
	}
]

export default routes
