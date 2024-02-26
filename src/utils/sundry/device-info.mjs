const { origin, pathname, search } = window.location

export const ua = window.navigator.userAgent.toLocaleLowerCase() // 当前浏览器
export const isAndroid = /android/.test(ua) // 是否为Android系统
export const isIos = /iphone|ipod|ipad/.test(ua) // 是否为IOS系统
export const isNative = /from:esalesapp/.test(ua) // 是否为客户端环境
export const isWx = ua.indexOf('micromessenger') !== -1 // 是否微信X5内核

const isDevOps = /\/\/pssdevopsbd\./.test(window.location.href)
export const isDevEnv = process.env.NODE_ENV === 'development'
export const isIntranet = /paic.com.cn/.test(origin) // 内网
export const isStg1 = /-stg1/.test(origin) // 测试1
export const isStg2 = /-stg2/.test(origin) // 测试2
export const isTest = isStg1 || isStg2 || isDevOps // 测试外网
export const isPrd = [
  'salescmscdn.pa18.com',
  'salescms.pa18.com',
  'pss-esales-cms.paic.com.cn'
]
  .map((str) => origin.includes(str))
  .includes(true)

export const isLogin = /^on/g.test(
  new URLSearchParams(search).get('isLogin') || ''
)
export const debugH5 = ua.indexOf('debugh5') !== -1 // 是否包含调试h5标识
export const isUiTest = window.name === 'edit-wrapper-iframe' // 自动化测试编辑窗口

// 状态栏高度
export const headerViewHeight =
  ua.split('headerviewheight=')[1] &&
  ua.split('headerviewheight=')[1].split(' ')[0]

// 容器高度
export const screenHeight =
  ua.split('screenheight=')[1] &&
  parseInt(ua.split('screenheight=')[1].split(' ')[0], 10)

// 当前模块名
export const MODULE_NAME =
  pathname.match(/(^\/)?(\w*)+(.html$){1}/)?.splice(2, 1) || ''

// app版本号
export const appVersion = isIos
  ? ua.split('esalesapp_v')[1] && ua.split('esalesapp_v')[1].split(' ')[0]
  : ua.split('esalesapp_v')[1] && ua.split('esalesapp_v')[1].split('_')[0]

// 设备id
export const deviceId = JSON.parse(
  isIos
    ? (ua.split('kdeappinfo=')[1] &&
        /\{([^\\}])*\}/g.exec(ua.split('kdeappinfo=')[1])?.shift()) ||
        '{}'
    : (ua.split('kdeappinfo=')[1] &&
        ua.split('kdeappinfo=')[1].split('_')[0]) ||
        '{}'
)['x-pss-device-id']
