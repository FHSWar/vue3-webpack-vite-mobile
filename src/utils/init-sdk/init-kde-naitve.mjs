// @ts-nocheck

import { isAndroid } from '@/utils'

const initKdeNative = (document, window) => {
  const ua = window.navigator.userAgent.toLocaleLowerCase() // 当前浏览器内核
  const isNative = /from:ehomeapp/.test(ua)
  const isIos = /iphone|ipod|ipad/.test(ua)
  window.cordova = {
    exec() {} // 模拟器上给exec赋一个空函数
  }

  // 当前浏览器
  if (isNative) {
    if (isIos) {
      const setupWebViewJavascriptBridge =
        function setupWebViewJavascriptBridge(callback) {
          if (window.WebViewJavascriptBridge) {
            callback(window.WebViewJavascriptBridge)
            return
          }
          if (window.WVJBCallbacks) {
            window.WVJBCallbacks.push(callback)
            return
          }
          window.WVJBCallbacks = [callback]
          const WVJBIframe = document.createElement('iframe')
          WVJBIframe.style.display = 'none'
          WVJBIframe.src = 'https://__bridge_loaded__'
          document.documentElement.appendChild(WVJBIframe)
          setTimeout(() => {
            document.documentElement.removeChild(WVJBIframe)
          }, 0)
        }
      window.cordova = {
        exec(success, fail, pluginName, methodName, option) {
          setupWebViewJavascriptBridge((bridge) => {
            bridge.callHandler(methodName, option, (res) => {
              try {
                if (res.flag === 'success') {
                  if (success) success(res.data || res)
                } else if (fail) fail(res.data || res)
              } catch (e) {
                console.error('bridge.callHandler 返回处理出错', e)
              }
            })
          })
        }
      }
    } else if (isAndroid && window.jsbridgeAndroid) {
      const cordovaTemp = {
        callbackId: Math.floor(Math.random() * 2000000000),
        callbacks: {},
        callbackStatus: {
          NO_RESULT: 0,
          OK: 1,
          CLASS_NOT_FOUND_EXCEPTION: 2,
          ILLEGAL_ACCESS_EXCEPTION: 3,
          INSTANTIATION_EXCEPTION: 4,
          MALFORMED_URL_EXCEPTION: 5,
          IO_EXCEPTION: 6,
          INVALID_ACTION: 7,
          JSON_EXCEPTION: 8,
          ERROR: 9
        },
        callbackFromNativeJs(
          callbackId,
          isSuccess,
          status,
          args,
          keepCallback
        ) {
          try {
            const callback = this.callbacks[callbackId]
            if (callback) {
              if (isSuccess && status === this.callbackStatus.OK) {
                if (callback.success) callback.success(args)
              } else if (!isSuccess) {
                if (callback.fail) callback.fail(args)
              }
              if (!keepCallback) {
                delete this.callbacks[callbackId]
              }
            }
          } catch (err) {
            const msg = `Error in ${
              isSuccess ? 'Success' : 'Error'
            } callbackId: ${callbackId} : ${err}`
            if (console && console.log) console.log(msg)
            throw err
          }
        },
        androidExec(service, action, callbackId, argsJson) {
          return window.prompt(
            argsJson,
            `jsbridge:${JSON.stringify([service, action, callbackId])}`
          )
        },
        typeName(val) {
          return Object.prototype.toString.call(val).slice(8, -1)
        },
        exec(success, fail, service, action, args) {
          args = args || []
          for (let i = 0; i < args.length; i++) {
            if (this.typeName(args[i]) === 'ArrayBuffer') {
              args[i] = window.btoa(
                String.fromCharCode.apply(null, new Uint8Array(args[i]))
              )
            }
          }
          const callbackId = service + this.callbackId++
          const argsJson = JSON.stringify(args)
          if (success || fail) {
            this.callbacks[callbackId] = {
              success,
              fail
            }
          }
          if (window.WebViewJavascriptBridge) {
            window.WebViewJavascriptBridge.exec(
              service,
              action,
              callbackId,
              argsJson
            )
          } else {
            window.prompt(
              argsJson,
              `jsbridge:${JSON.stringify([service, action, callbackId])}`
            )
          }
        }
      }
      window.cordova = cordovaTemp
    }
  }
}

export default initKdeNative
