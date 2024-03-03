import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
	{
		path: '/home-view',
		name: 'home-view',
		component: () => import('@/modules/demo/views/home-view.vue')
	},
	{
		path: '/about-one',
		name: 'about-one',
		component: () => import('@/modules/demo/views/about-one.vue')
	},
	{
		path: '/about-two',
		name: 'about-two',
		component: () => import('@/modules/demo/views/about-two/index.vue')
	}
]

export default routes
