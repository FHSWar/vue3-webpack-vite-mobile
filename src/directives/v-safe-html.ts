import { DirectiveBinding } from 'vue'
import { type IFilterXSSOptions } from 'xss'

const vSafeHtml = {
  async beforeMount(el: HTMLElement, binding: DirectiveBinding<string>) {
    if (binding.value) {
      const { default: xss } = await import('xss')
      const xssOptions = (await import(
        '@/utils/sundry/xss-white-list'
      )) as IFilterXSSOptions
      el.innerHTML = xss(binding.value, xssOptions)
    }
  },
  async updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    if (binding.value !== binding.oldValue) {
      const { default: xss } = await import('xss')
      const xssOptions = (await import(
        '@/utils/sundry/xss-white-list'
      )) as IFilterXSSOptions
      el.innerHTML = xss(binding.value, xssOptions)
    }
  }
}

export default vSafeHtml
