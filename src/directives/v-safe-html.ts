import { DirectiveBinding } from 'vue'

const vSafeHtml = {
  async beforeMount(el: HTMLElement, binding: DirectiveBinding<string>) {
    if (binding.value) {
      const { default: DOMPurify } = await import('dompurify')
      el.innerHTML = DOMPurify.sanitize(binding.value)
    }
  },
  async updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    if (binding.value !== binding.oldValue) {
      const { default: DOMPurify } = await import('dompurify')
      el.innerHTML = DOMPurify.sanitize(binding.value)
    }
  }
}

/* // xss版本
import { DirectiveBinding } from 'vue'
import { type IFilterXSSOptions } from 'xss'

const vSafeHtml = {
  async beforeMount(el: HTMLElement, binding: DirectiveBinding<string>) {
    if (binding.value) {
      const { default: xss } = await import('xss')
      const xssOptions = (await import(
        '@/utils/sundry/xss-white-list'
      )) as IFilterXSSOptions

      console.log(
        'xss(binding.value) beforeMount',
        xss(binding.value, xssOptions)
      )
      // ❗️bad: `<div style="width: 100px; height: 100px; background-color: red"></div>` 变成了 `<div></div>`
      el.innerHTML = xss(binding.value, xssOptions)
    }
  },
  async updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    if (binding.value !== binding.oldValue) {
      const { default: xss } = await import('xss')
      const xssOptions = (await import(
        '@/utils/sundry/xss-white-list'
      )) as IFilterXSSOptions
      console.log('xss(binding.value) updated', xss(binding.value, xssOptions))
      el.innerHTML = xss(binding.value, xssOptions)
    }
  }
} */

export default vSafeHtml
