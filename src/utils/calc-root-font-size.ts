/* 定义根字号大小 */
const calRootFontSize = (document: Document, window: Window) => {
  const docEl = document.documentElement
  const resizeEvt =
    'orientationchange' in window ? 'orientationchange' : 'resize'
  function recalc() {
    const { clientWidth } = docEl
    if (!clientWidth) return

    // if (clientWidth / 750 > 0.6)
    //   docEl.style.fontSize = `${50 * 0.6 * (clientWidth / 375)}px`
    // else
    //   docEl.style.fontSize = `${((50 * clientWidth) / 750) * (clientWidth / 375)}px`
  }

  if (!document.addEventListener) return
  recalc()
  window.addEventListener(resizeEvt, recalc, false)
  document.addEventListener('DOMContentLoaded', recalc, false)
}

export default calRootFontSize
