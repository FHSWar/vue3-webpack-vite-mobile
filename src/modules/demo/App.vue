<template>
  <div id="app">
    <h1 class="text-[50px] font-bold underline">Hello world!</h1>
    <p class="font-bold underline">测试pxtorem</p>
    <div class="default-font">
      <p>You have stay here for {{ count }} second, click time: {{ fhs }}</p>

      <var-button>选择单个日期</var-button>
    </div>
  </div>
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
