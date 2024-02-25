// @ts-nocheck

/* UI 自动化接入 */
import { createScript, isIos, isNative, isPrd, isIntranet } from '@/utils'

const initUIAutomation = () => {
  window.document.addEventListener('load', () => {
    const isUiTest = window.name === 'edit-wrapper-iframe'
    // 测试环境UI自动化接入，测试环境使用，加载ui-test.js
    if (isUiTest || (isNative && !isPrd)) {
      if (isIntranet) {
        createScript(
          'https://pssdevopsbd.paic.com.cn/appStatic/esales-jslib/1.0/uiTest/ui-test.js'
        )
      } else {
        createScript(
          'https://pssdevopsbd.pa18.com/appStatic/esales-jslib/1.0/uiTest/ui-test.js'
        )
      }
    }

    // 处理当vue页面没有加载处理并且是全屏场景，出现白屏，使能返回native首页
    const isFullScreen = window.location.href.includes('fullScreen')
    const dom = document.getElementById('fullScreen-backIcon')
    let barHeight = 0
    if (dom && isFullScreen) {
      window.cordova.exec(
        (res) => {
          if (typeof res === 'string') {
            res = JSON.parse(res)
          }
          barHeight = res.mobileSystemBarHeight / window.devicePixelRatio
          dom.style.display = 'inline-block'
          dom.style.top = `${barHeight}px`
          dom.addEventListener(
            'click',
            () => {
              window.cordova.exec(
                () => {},
                () => {},
                'commTools',
                'backNativeWebview',
                isIos ? {} : [{}]
              )
            },
            false
          )
        },
        () => {},
        'commTools',
        'setWebViewNoNativeHead',
        isIos
          ? { data: { statusbarTextColorStyle: '1' } }
          : [{ data: { statusbarTextColorStyle: '1' } }]
      )
    }
  })
}

export default initUIAutomation
