<template>
	首页
	<!-- <div v-safe-html="htmlStr"></div> -->
</template>

<script lang="ts" setup>
import axios from '@/apis/index'
import { useModulePinia } from '../store'

interface ResData {
	user: {
		name: string
		child: {
			name: string
		}[]
	}[]
}

// const htmlStr = `<div style="width: 100px; height: 100px; background-color: red"></div><img src="x" onerror="alert('恶意代码👻')"/>`
const store = useModulePinia()

if (process.env) {
	console.log(
		`VUEP_BASE_URL=${process.env.VUE_BASE_URL}`,
		process.env.BUILD_TIME
	)
}
setInterval(() => {
	store.increment()
}, 1000)

axios.get<ResData>('/head.json', {}).then((res) => {
	console.log(res)
})
</script>
