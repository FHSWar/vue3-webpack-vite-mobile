// @ts-nocheck
import { isAndroid, isIos } from '@/utils'

/* 动态加载js文件 */
export const createScript = (url) => {
  const scriptElement = document.createElement('script')
  document.body.append(scriptElement)
  const promise = new Promise((resolve, reject) => {
    scriptElement.addEventListener(
      'load',
      (e) => {
        resolve(e)
      },
      false
    )
    scriptElement.addEventListener(
      'error',
      (e) => {
        document.body.removeChild(scriptElement)
        reject(e)
      },
      false
    )
  })
  scriptElement.src = url
  return promise
}

/* 测试环境h5调试 */
export function erudaDebugger({ isPrd, isNative, debugH5 }, cb) {
  // 根据环境初始化变量
  if (!isPrd || debugH5) {
    if (!isNative) {
      window.PAWAObj.userInfo = {
        agentNo: '1120101001',
        // agentNo: '1040100264',
        userRole: 'manager', // director  manager
        // userRole: 'director',
        branchCode: '12', // '08'

        PWDStrengthTips: '',
        PWDStrengthTipsSwitch: 'N',
        agentGroup: '112010401',
        // agentGroup: '104030104',
        agentName: '杨祖能',
        agentSex: '男',
        agentType: '01',
        areaNo: '',
        autoURL: 'https://test1-auto.pa18.com',
        branchName: '浙江分公司',
        cdnURL:
          'https://onguisimy.bkt.clouddn.com/268/SMTResourceNew/esalesPro',
        cellphone: '139****5080',
        clientCenterNativeSwitch: 'Y',
        cmsConfigUrl: '',
        company: '',
        downloadAddress: '#',
        environmentInterFace: '/wstg1Deployed2',
        examDirectSwitch: 'on',
        examRecommendSwitch: 'off',
        headImgUrl:
          'https://stg.iobs.pingan.com.cn/' +
          'download/pss-esales-cms-dmz-dev/pub-homepageAttach-iobs-20210228-1120103025-_-_-1614508941580.jpg',
        healthActivityStarFlag: 'true',
        icsURL: 'https://pss-ics-core-padis-dmzstg1.pa18.com',
        insurancePsspSwitch: 'off',
        inviteContactSwitch: 'on',
        isPopup: 'Y',
        isShowNativeIndex: 'Y',
        isShowVPSwitch: 'N',
        lbsRegionCode: '120021',
        lifeNewURL: 'https://sales-new-dmzstg1.pa18.com:10216/lifenew',
        lifeURL: 'https://salestest-dmzstg2.pa18.com:20443',
        mHeadImgUrl:
          'https://stg.iobs.pingan.com.cn/' +
          'download/pss-esales-cms-dmz-dev/pub-homepageAttach-iobs-20210228-1120103025-_-_-1614508941580.jpg',
        message: '登陆成功',
        newSessionOverManageSwitch: 'on',
        parentDeptNo: '1120104',
        psspSwitch: 'on',
        psspURL: 'https://pss-esales-pssp-bx-stg1-web-padis.paic.com.cn',
        pubURL: 'https://salestest-dmzstg2.pa18.com:20443',
        regionCode: '1200',
        regionName: '浙江',
        result: 'Y',
        sessionID: '',
        shareSwitch: 'on',
        shopURL:
          'https://pa18-mit-shop-bx-stg1-web-padis.paic.com.cn/ebusiness',
        socialCloudToken: 'cX3GObrtyoTzg2D3mhLjicGq1jM=',
        spartaSwitch: 'N',
        springActivityStarFlag: 'false',
        timestamp: '1632819971933',
        userHeadPic:
          'https://stg.iobs.pingan.com.cn/' +
          'download/pss-esales-cms-dmz-dev/pub-homepageAttach-iobs-20210913-1120101001-_-_-1631513463254.png',
        vueInsuaranceQuerySwitch: 'on'
      }
    }

    createScript(
      'https://salescmscdn.pa18.com/appStatic/esales-jslib/vConsole/eruda.min.js'
    ).then(
      () => {
        window.eruda.init({
          tool: [
            'console',
            'elements',
            'network',
            'resources',
            'sources',
            'info'
          ],
          useShadowDom: true
        })
        if (cb) cb()
      },
      () => {
        console.log('加载eruda出错')
        if (cb) cb()
      }
    )
  } else if (cb) cb()
}

// 获取android 或者ios版本号
export const getPlatformVersion = (useAgent) => {
  // eslint-disable-next-line
  const _useAgent = useAgent || window.navigator.userAgent
  let sysVersion = 10
  try {
    if (isIos) {
      sysVersion = parseFloat(
        _useAgent
          .match(/OS \d+_\d[_\d]* like Mac OS X/i)[0]
          .split(/\s/)[1]
          .replace(/_/g, '.')
      )
    }
    if (isAndroid) {
      sysVersion = parseFloat(
        _useAgent.match(/Android .*;/)[0].split(/\s|;/)[1]
      )
    }
  } catch (e) {
    sysVersion = 0
  }
  if (!sysVersion) {
    return 10
  }
  return sysVersion
}

/**
 * 获取页面的访问路径标识，不带参数的地址，如/as/kde-esales-vue/module/eDianTong.html#/index
 */
export const getPagePath = () => {
  const { pathname } = window.location
  const { hash } = window.location
  return pathname + hash.split('?')[0]
}

/**
 * 获取当前页面或指定页面地址的参数值
 * @param {String} name 参数名
 * @param url {String} url 页面地址，默认当前页面地址
 * @param flag {Boolean} flag 如果search和hash有相同参数可以传flag， 默认false先取search后面参数，取不到再取hash后面参数，true只取hash后面参数
 * @returns {string}
 */
export const getUrlQuery = (name, url, flag = false) => {
  // 参数：变量名，url为空则表从当前页面的url中取
  const searchStr = window.location.search
    .replace('&amp;', '&')
    .replace(/\/$/, '')
  const hashStr = window.location.hash.replace('&amp;', '&').replace(/\/$/, '')
  // 只传name和flag时
  if (typeof url === 'boolean') {
    flag = url
    url = ''
  }
  let u = url || searchStr
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  let r = u.substr(u.indexOf('?') + 1).match(reg)
  if (r == null || flag) {
    u = url || hashStr
    r = u.substr(u.indexOf('?') + 1).match(reg)
  }
  return r !== null ? r[2] : ''
}
