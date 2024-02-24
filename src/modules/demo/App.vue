<template>
  <pss-space id="app" class="text-[24px]">
    <div>
      <p>You have stay here for {{ count }} second, click time: {{ fhs }}</p>
    </div>
    <div>
      <p class="font-bold underline">Hello world!</p>
      <p class="underline">测试pxtorem</p>
    </div>
    <div>
      <pss-button @click="show = true">选择单个日期</pss-button>
      <pss-button type="primary" @click="picker">多列选择</pss-button>
      <pss-icon name="information" />
    </div>
    <pss-popup v-model:show="popupShow" position="bottom">
      <div>demo页面demo组件使用<br /><br /><br /><br /><br /></div>
    </pss-popup>
    <pss-calendar v-model:show="show" @confirm="onConfirm" />
  </pss-space>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import axios from '@/apis/index'

interface ResData {
  user: {
    name: string
    child: {
      name: string
    }[]
  }[]
}

const store = useStore()
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

const count = computed(() => store.state.count)
if (process.env) {
  console.log(
    `VUEP_BASE_URL=${process.env.VUE_BASE_URL}`,
    process.env.BUILD_TIME
  )
}
setInterval(() => {
  store.dispatch('countUp')
}, 1000)

axios.get<ResData>('/head.json', {}).then((res) => {
  console.log(res)
})
</script>
