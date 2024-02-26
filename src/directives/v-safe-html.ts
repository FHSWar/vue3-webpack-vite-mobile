import { DirectiveBinding } from 'vue'

// xss版本
const vSafeHtml = {
  async beforeMount(el: HTMLElement, binding: DirectiveBinding<string>) {
    if (binding.value) {
      const { default: xss } = await import('xss')
      const xssOptions = await import('@/utils/sundry/xss-white-list.json')

      el.innerHTML = xss(binding.value, xssOptions)
    }
  },
  async updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    if (binding.value !== binding.oldValue) {
      const { default: xss } = await import('xss')
      const xssOptions = await import('@/utils/sundry/xss-white-list.json')

      el.innerHTML = xss(binding.value, xssOptions)
    }
  }
}

/* const vSafeHtml = {
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
} */

export default vSafeHtml
