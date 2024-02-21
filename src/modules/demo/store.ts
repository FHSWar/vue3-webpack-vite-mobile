import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0,
    fhs: 'fhs'
  },
  mutations: {
    increment(state) {
      state.count++
    },
    decrement(state) {
      state.count--
    }
  },
  actions: {
    countUp(ctx) {
      ctx.commit('increment')
    },
    countDown(ctx) {
      ctx.commit('decrement')
    }
  },
  modules: {}
})
