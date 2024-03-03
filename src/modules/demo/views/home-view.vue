<template>
	<pss-space id="app" class="p-[8px] text-[24px]">
		<div>
			<p>You have stay here for {{ count }} second, click time: {{ fhs }}</p>
		</div>
		<div>
			<p class="font-bold underline">Hello world!</p>
			<p class="underline">测试pxtorem</p>
		</div>
		<div>
			<pss-space>
				<pss-button type="success" @click="popupShow = true">
					显示popup
				</pss-button>
				<pss-button @click="show = true"> 选择单个日期 </pss-button>
				<pss-button type="primary" @click="picker">多列选择</pss-button>
			</pss-space>
		</div>
		<pss-popup v-model:show="popupShow" position="bottom">
			<div class="h-[500px]">demo页面demo组件使用</div>
		</pss-popup>
		<pss-calendar v-model:show="show" @confirm="onConfirm" />
	</pss-space>
	<!-- <div v-safe-html="htmlStr"></div> -->
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
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
const fhs = ref(0)
const popupShow = ref(false)
const show = ref(false)

const date = ref('')
const formatDate = (innerDate: Date) =>
	`${innerDate.getMonth() + 1}/${innerDate.getDate()}`
const onConfirm = (value: Date) => {
	show.value = false
	date.value = formatDate(value)
}

const columns = [
	Array.from({ length: 20 }).map((_, index) => index),
	Array.from({ length: 20 }).map((_, index) => index),
	Array.from({ length: 20 }).map((_, index) => index)
]
async function picker() {
	const { state, texts, indexes } = await Picker(columns)
	console.log('state, texts, indexes', state, texts, indexes)
}

const count = computed(() => store.count)
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
