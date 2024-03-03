import { defineStore } from 'pinia'

export { useCommonPinia } from '@/utils'
export const useModulePinia = defineStore('demo', {
	state: () => ({
		count: 0,
		fhs: 'fhs'
	}),
	actions: {
		increment() {
			this.count += 1
		},
		decrement() {
			this.count -= 1
		}
	}
})
