<template>
  <div id="app">
    <h1 class="text-[50px] font-bold underline">Hello world!</h1>
    <p class="font-bold underline">测试pxtorem</p>
    <div class="default-font">
      <p>
        You have stay here for {{ count }} second, click time: {{ suporka }}
      </p>
      <button @click="suporka += 1">click</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from 'vue'
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
export default defineComponent({
  setup() {
    const data = reactive({
      show: true
    })
    const store = useStore()
    const count = computed(() => store.state.count)
    const data2 = reactive({
      val: 0,
      ifShowMask: false,
      suporka: 1,
      testArray: Array.from([])
    })
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
    return { ...toRefs(data), ...toRefs(data2), count }
  }
})
</script>
