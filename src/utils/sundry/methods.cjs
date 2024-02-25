import { isAndroid, isIos } from './device-info.cjs'

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
	const _useAgent = useAgent || window.navigator.userAgent;
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

/**
 * 导出页面为PNG图片格式
 * html2Canvas(html转图片插件)
 * dom(需要导出的dom节点)
 * scale(放大倍数，提升清晰度)
 * title(导出文件名)
 */
export const getPng = (html2Canvas, dom, scale, title, reaScale) =>
  new Promise((resolve) => {
    if (dom) {
      // DOM 节点计算后宽高
      const box = window.getComputedStyle(dom)
      const width = parseInt(box.width, 10)
      const height = parseInt(box.height, 10)
      // 获取像素比，放大3倍，提升清晰度
      let scaleBy = window.devicePixelRatio ? window.devicePixelRatio : 3
      if (scaleBy < scale) scaleBy = scale
      if (reaScale) {
        scaleBy = reaScale
      }
      // 设定 canvas 元素属性宽高为 DOM 节点宽高 * 像素比
      const canvas = document.createElement('canvas')
      canvas.width = width * scaleBy
      canvas.height = height * scaleBy
      // 设定 canvas css宽高为 DOM 节点宽高
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      // 将所有绘制内容放大像素比倍
      const context = canvas.getContext('2d')
      context.scale(scaleBy, scaleBy)
      // 生成canvas
      html2Canvas(dom, {
        canvas,
        scale: scaleBy,
        useCORS: true,
        allowTaint: false,
        width,
        height
      })
        .then((htmlCanvas) => {
          // canvas转png图片下载
          const dataurl = htmlCanvas.toDataURL('image/png')
          const blob = dataurl.split(',')[1]
          // let image = document.createElement("a");
          // image.setAttribute('href', dataurl);
          // image.setAttribute('style', 'visibility:hidden');
          // image.setAttribute('download', `${ title }.png`);
          // document.body.appendChild(image);
          // image.click();
          // document.body.removeChild(image);
          resolve(blob)
        })
        .catch((err) => {
          console.log(err)
          resolve(err)
        })
    } else {
      resolve('')
    }
  })

/**
 * 模块间跳转公共方法
 * @param moduleName 模块名称 例如：:exam"
 * @param routerHash 路由名称 不携带"/" 例如："exam_list"
 * @param param 跳转路由参数 例如： #／exam_list？name=11
 */
export const toPage = (moduleName, routerHash, param) => {
  if (!moduleName || !routerHash) return
  let { pathname } = window.location
  pathname = pathname.substr(0, pathname.lastIndexOf('/'))
  if (param) {
    window.location.href = `${
      window.location.origin + pathname
    }/${moduleName}.html${window.location.search}#/${routerHash}?${param}`
  } else {
    window.location.href = `${
      window.location.origin + pathname
    }/${moduleName}.html${window.location.search}#/${routerHash}`
  }
}
