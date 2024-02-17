<template>
  <div id="app">
    <h1 class="text-[50px] font-bold underline">Hello world!</h1>
    <p class="font-bold underline">测试pxtorem</p>
    <div class="default-font">
      <p>
        You have stay here for {{ count }} second, click time: {{ suporka }}
      </p>
      <button @click="suporka += 1">click</button>
      <pss-icon name="information" />
      <pss-button type="info" @click="popupShow = true">信息按钮</pss-button>
      <pss-popup v-model:show="popupShow" position="bottom">
        <div>demo页面demo组件使用<br /><br /><br /><br /><br /></div>
      </pss-popup>
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
const suporka = ref(0)
const popupShow = ref(false)
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
