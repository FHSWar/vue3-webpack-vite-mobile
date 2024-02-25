/**
 * @file native接口文件
 */
import { appVersion } from '@config'

const KdeNative = {
  initNum: 0,
  /**
   * native全局调用的方法
   * @type {Array}
   * receiveVoiceText  千人千面》答案优化意见反馈--实时获取用户语音
   * jsGetMessageFromNative  任务助手》新消息推送功能
   * taskCenterRefresh 任务中心刷新
   * taskCenterPullData 任务中心重新拉取数据方法
   */
  eventName: [
    'receiveVoiceText',
    'showText',
    'jsGetMessageFromNative',
    'taskCenterRefresh',
    'oralSpeed',
    'taskCenterPullData'
  ],
  addEvent: (name, callback) => {
    if (!KdeNative.eventName.includes(name)) {
      //  先添加处理方法到eventName
      return
    }

    if (!callback) callback = () => {}

    window[name] = callback
  },
  /**
   * 调用native方法
   * @param interval 执行间隔时间
   * @param callback 需要地的函数
   * @param timeout  超时时间
   * @param execName cordova插件方法名称
   */
  execNativeMethod(interval, callback, timeout, execName) {
    // 对cordova.exec统一做异常处理
    const cb = () => {
      try {
        if (callback) callback()
      } catch (e) {
        //  console.log('execwindow.cordova error', e)
      }
    }
    // cordova加载成功直接执行
    if (!!window.cordova && window.cordova.exec) {
      cb()
      return
    }

    // 首次加载判断cordova.exec是否加载成功
    const count = 0
    const maxCount = Math.floor(timeout / interval) || 50
    let timer = null
    const fn = () => {
      if (window.cordova && window.cordova.exec) {
        cb()
        return
      }
      if (count > maxCount) {
        console.error('cordova is null', callback.toString())
        // 每个模块都会先调用getEnvironmentAndEntrance，getEnvironmentAndEntrance未初始化成功，刷新页面
        if (execName === 'getEnvironmentAndEntrance') {
          clearTimeout(timer)
        }
        return
      }
      timer = setTimeout(fn, interval)
    }
    fn()
  },

  userInfo: () => {
    if (KdeNative.initNum === 0) {
      KdeNative.getUserInfo(
        {},
        (opt) => {
          let loginInfo = opt
          if (typeof opt === 'string') loginInfo = JSON.parse(opt)
          window.PAWAObj.userInfo = loginInfo.userInfo
          window.PAWAObj.getUserInfo = true
        },
        () => {
          console.error('getUserInfo error')
        }
      )
    }
    KdeNative.initNum++
  },

  /**
   * @param options Object
   * title 头部提示
   * rightBtnText 右边文字
   * leftBtnText 左边文字
   * rightBtnClick 右边点击事件
   * leftBtnClick 左边点击事件
   */
  setHeader: (options, success, error) => {
    const option = options
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(success, error, 'insurance', 'set_header', [option])
      },
      5000
    )
  },

  hideHeader: (success, error) => {
    const option = {
      isHideHeader: 'Y'
    }
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(success, error, 'insurance', 'isHideHeader', [
          option
        ])
      },
      5000
    )
  },

  showHeader: (success, error) => {
    const option = {
      isHideHeader: 'N'
    }
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(success, error, 'insurance', 'isHideHeader', [
          option
        ])
      },
      5000
    )
  },

  /**
   * @param
   * 获取用户信息
   */
  getUserInfo: (options, success, error) => {
    const option = options
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          success,
          error,
          'commTools',
          'getEnvironmentAndEntrance',
          [option]
        )
      },
      2000,
      'getEnvironmentAndEntrance'
    )
  },

  /**
   * @param
   * native webview初始化完成
   */
  loadCompleted: (options, success, error) => {
    const option = options
    KdeNative.userInfo()
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(success, error, 'commTools', 'loadCompleted', [
          option
        ])
      },
      2000
    )
  },

  /**
   * -----------------------------------------------------------------------------------------
   * native 测滑关闭功能
   * @date 2021年7月30日版本上线，支持版本号：7.12
   *
   * @param {Object} options
   * @callback onSuccess
   * @callback onFail
   *  -----------------------------------------------------------------------------------------
   */
  backForwardNavigationGestures: (
    // eslint-disable-next-line default-param-last
    { allowsBackForwardNavigationGestures = 'N' } = {},
    success,
    onFail
  ) => {
    if (appVersion < 7.12) {
      return
    }
    const options = {
      allowsBackForwardNavigationGestures
    }
    console.log(
      allowsBackForwardNavigationGestures,
      'allowsBackForwardNavigationGestures'
    )
    KdeNative.execNativeMethod(
      20,
      () => {
        if (window.cordova.exec)
          window.cordova.exec(
            success,
            onFail,
            'KdePlugin',
            'backForwardNavigationGestures',
            [options]
          )
      },
      2000
    )
  },

  /**
   * -----------------------------------------------------------------------------------------
   * 通知native页面加载成功，隐藏native回退按钮
   * @date 2021年1月30日版本上线，支持版本号：6.16
   *
   * @param {Object} options
   *  allowsBackForwardNavigationGestures 是否开启 Y开启、N关闭
   * @callback onSuccess
   * @callback onFail
   *  -----------------------------------------------------------------------------------------
   */
  webviewIsReady: (options, onSuccess = null, onFail = null) => {
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'KdePlugin', 'webviewIsReady', [
          options
        ])
      },
      2000
    )
  },

  /**
   *  -----------------------------------------------------------------------------------------
   * 启动一个新容器
   * @date 2020年8月25日版本新增方法：支持版本号：6.16
   *       showHeadView ios需要子在6.17版本以后才支持
   *
   * @param {Object} options
   * webUrl: ''                       // 要加载的url
   * showHeader: '',                  // 加载过程中是否展示native头部 Y 展示 N/null 不展示
   * isLandScape: false,              // 是否横屏，boolean类型，true|false
   * needPopLastViewController: 'N',  // 是否需要关闭上一个界面，Y|N
   * showHeadView: false,             // 是否一直显示头部view，boolean类型，true|false
   * cache: 'Y',                      // 是否使用webview缓存，Y使用webview缓存|N不使用缓存
   * @callback onSuccess
   * @callback onFail
   *  -----------------------------------------------------------------------------------------
   */
  openNewWebview: (
    // eslint-disable-next-line default-param-last
    {
      webUrl = '',
      showHeader = 'Y',
      isLandScape = false,
      needPopLastViewController = 'N',
      showHeadView = false
    } = {},
    success,
    onFail
  ) => {
    const options = {
      webUrl,
      showHeader,
      isLandScape,
      needPopLastViewController,
      showHeadView
    }
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(success, onFail, 'KdePlugin', 'openNewWebview', [
          options
        ])
      },
      2000
    )
  },

  /**
   *  -----------------------------------------------------------------------------------------
   * 控制窗口在输入状态下是否往上顶起
   * @date 2020年9月25日版本新增方法：支持版本号：6.18
   *
   * @param {Object} options
   * canScroll: 'Y'                    // 页面是否往上推，’Y‘是，’N‘否，默认为Y
   * @callback onSuccess
   * @callback onFail
   *  -----------------------------------------------------------------------------------------
   */
  // eslint-disable-next-line default-param-last
  controllerScrollWebView: ({ canScroll = 'Y' } = {}, success, onFail) => {
    if (appVersion < 6.17) {
      return
    }
    const options = {
      canScroll
    }
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          success,
          onFail,
          'KdePlugin',
          'controllerScrollWebView',
          [options]
        )
      },
      5000
    )
  },

  /**
   * @param
   * 返回至native的webview
   */
  backNativeWebview: (options, success, error) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(success, error, 'commTools', 'enterMenuActivity', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 直接退出h5容器,返回到native页面
   */
  insuranceBack: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'insurance', 'toHomePage', [
          option
        ])
      },
      2000
    )
  },

  /** 直接退出多页面容器,返回到上一级
   */
  insurance_back: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'insurance', 'insurance_back', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 打开新的多页面容器，并装入目标地址的h5页面
   * @param  {[type]} options   [{targetPage:"目标的h5地址"}]
   * @param  {[type]} onSuccess [成功回调函数]
   * @param  {[type]} onFail    [失败回调函数]
   */
  toInsurancePageWh: (options, onSuccess, onFail) => {
    options = options || {}
    window.cordova.exec(onSuccess, onFail, 'insurance', 'to_insurance_page', [
      options
    ])
  },

  goMultiPage: (options, onSuccess, onFail) => {
    //  console.log('======= toMultiPage')
    options = options || {}
    window.cordova.exec(onSuccess, onFail, 'commTools2', 'toMultiPage', [
      options
    ])
  },

  /**
   * 跳转到指定的页面
   * @param {Object} options 参数
   * {
   *   url:指定的页面
   *   flag:'fromfinancial'(知鸟)，'toClaimCallPolice'(理赔页面跳转)
   * }
   */
  goto_financial_consult: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools2',
          'goto_financial_consult',
          [option]
        )
      },
      2000
    )
  },
  /**
   * 分享
   * 操作菜单下拉框
   *
   * @param {Object} options 参数
   * {
   *      title: 分享标题
   *      imgURL: 图片地址
   *      content: 类容地址
   *      srcType: 分享源标识
   * }
   */
  shareTo: (options, onSuccess, onFail) => {
    options = options || {}
    window.cordova.exec(onSuccess, onFail, 'commTools', 'shareTo', [options])
  },
  /**
   * 分享到微信
   * 操作菜单下拉框
   *
   * @param {Object} options 参数
   * {
       shareChannel: group/single :朋友圈/朋友
   *      title: 分享标题
   *      iconURL: 小图标地址
   *      webpageURL: 分享网页地址
       description: 分享内容简介
   * }
   */
  shareToWeixin: (options, onSuccess, onFail) => {
    options = options || {}
    window.cordova.exec(onSuccess, onFail, 'commTools2', 'shareToWeixin', [
      options
    ])
  },
  /**
   * 选择图片上传
   * {
      "params": JSON.stringify(param),
      "uploadUrl": "/life/selfhire.uploadPhotograph.do5",
      "isCut" : "N",
      "maxCertImg": "5242880",
      "quality": "90",
      "photoTip" : photoTip
    }
   * */
  showPicturePicker: (onSuccess, onFail, url, imageIdentifier) => {
    window.cordova.exec(
      onSuccess,
      onFail,
      'PicturePickUp',
      'showPicturePicker',
      [url, imageIdentifier]
    )
  },

  /**
   * -----------------------------------------------------------------------------------------
   * 选择图片上传
   * @date 2020年8月25日版本上线，支持版本号：6.16
   *
   * @param {Object} options
   * imageW:"200”,                      // 图片宽，单位像素
   * imageH:"200”,                      // 图片高，单位像素
   * isCut: false,                      // 裁剪标识" Y/N-默认不裁剪
   * maxCertImg: '610241014'            // 必传，图片允许文件最大值 (单位：b)
   * quality: "",                       // 必传，图片初始默认压缩比 (1~100)
   * imageCount:                        // 图片个数 - 为空则默认 1 张， 最多只能选择 9 张
   * nativePageNo:                      // 必传，H5调用页面的埋点
   * isTakePicture:                     // 选取类型（Y/N）Y 为打开相机，N 为进入相册，为空则两项都有
   * systemPrivilegeSceneId: '',        // 必传，需要使用到的权限类型
   * systemPrivilegeToastContent: '',   // 必传，场景 ID
   * systemPrivilege: '',               // 必传，泰山计划弹框显示的提示语
   * systemPrivilegeAlwaysToast: '',    // 必传，是否每次都弹窗
   *
   * @callback onSuccess
   * 出参json：{"base64":["base64"],"selectCount":"5","isEnd":"Y"}  (一次上传一张图片)
   *      // selectCount用户选择图片数量
   *      // isEnd是否是最后一张图片 "Y"代表是最后一张
   * @callback onFail
   *  -----------------------------------------------------------------------------------------
   */
  showPicture: (
    {
      imageW = '',
      imageH = '',
      isCut = '',
      maxCertImg = '610241014',
      quality = '90',
      imageCount = '',
      isTakePicture = '',
      systemPrivilegeToastContent = '允许使用相机拍照或读取系统相册中的【图片/视频】，获取的【图片/视频】将用于【图片/视频上传】，请确认是否授权'
    } = {},
    onSuccess = null,
    onFail = null
  ) => {
    const h = window.location.href
    const o = h.split('.html')[0].split('/').pop()
    const n = h.split('#/')[1].split('?')[0]
    const pageItem = window.pageTrackPoint ? window.pageTrackPoint[o] : ''
    const pageNo =
      pageItem && pageItem[n] && pageItem[n].pageNo ? pageItem[n].pageNo : ''
    const options = {
      imageW,
      imageH,
      isCut,
      maxCertImg,
      quality,
      imageCount,
      nativePageNo: pageNo,
      isTakePicture,
      systemPrivilegeSceneId: `MANAGE_${pageNo}`,
      systemPrivilegeToastContent,
      systemPrivilege: 'CAMERA_PHOTO',
      systemPrivilegeAlwaysToast: 'N'
    }
    window.cordova.exec(onSuccess, onFail, 'KdePlugin', 'showPicture', [
      options
    ])
  },

  /**
   * 跳转到展E宝,产品详情页
   */
  skip_detail_page: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'ELifeAssist',
          'skip_detail_page',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 跳转到展E宝首页
   */
  gotoZEB: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'gotoZEB', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 跳转到展E宝(发现--里面菜单)
   * {
   *   detailType:'T',（T-行销工具）
   *   IdSalesLead:'主管辅导',
   *    shareMethod:'wechat_friend|cover|cut_picture',//支持的分享渠道为：微信好友、封面图分享、截屏分享
   *   data:{}详见主管辅导模块跳转单元6
   * }
   */
  to_zeb_detail: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'ELifeAssist', 'to_zeb_detail', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 关闭问卷页面
   */
  enterMenuActivity: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools',
          'enterMenuActivity',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 跳转理赔进度
   * @param {Object} options 参数
   * {"router": "claim/pocketEsales/queryHistoryCaseList"} //目前理赔查询的页面锚点是这个，以后如果想跳转理赔某个锚点就传参过来
   *
   */
  gotoPocketClaim: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'claim', 'gotoPocketClaim', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 多页面跳单页面,不销毁容器,每次跳单页面会新增容器（Native不推荐使用）
   * @param {Object} options 参数
   * options:{
   *   roteUrl:"wiqa/wiqa/wiqaIndexMenu"
   * }
   */
  toSinglePage: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'insurance', 'to_single_page', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 多页面跳单页面,不销毁容器,所有单页面公用这个容器(问了安卓的会销毁多页容器)
   * @param {Object} options 参数
   * {"roteUrl":"wiqa/wiqa/wiqaIndexMenu"}
   */
  toCertainPage: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'insurance', 'toCertainPage', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 多页面单页面互跳,销毁容器（暂时只有android可以使用，ios2017／8／28发包会新增）
   * @param {Object} options 参数
   * {"container":"1","url" :多页面路径}
   * {"container":"0","url" :单页面的埋点}
   */
  jump_switch_webview: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'insurance',
          'jump_switch_webview',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 打开指定的URI,如果是URL,则跳到浏览器， 如果的电话号码，则跳转到拨号界面
   * @param {String} type 类型
   * @param {String} uri 链接
   *    目前uri支持的类型有
   *    1.url:打开网页http://xxx(https://xxxx)、
   *    2.tel:调转到拨号界面拨打电话号码10086、
   *    3.sms:跳转到短信界面发送短信10086、
   *    4.mail:发送email sss@163.com
   *    5.map:跳转到地图 39.9,116.3,cityName
   *    6.appRate:跳转到AppStore评分 appId
   * @param {Object} args 打开不同的uri附带的参数
   *    1.打开网页参数为空 例子openUri('url', 'http://www.baidu.com', {});
   *    2.拨号界面参数为空 例子openUri('tel', '10086', {});
   *    3.发送短信参数为{sms_body:'sms_content'} 例子openUri('sms', '10086,10010', {sms_body:'sms_content'});
   *    4.发送email {subject:'subjct',text:'textContent'}
   *          例子openUri('mail', 'asd@163.com,asdf@163.com' {subjct:'subject', text:'textConten'});
   *    5.跳转到地图参数为空{} 例子openUri('map', '' {latitude:104.04, longitude: 44.00, city:'shenzhen'})
   *    6.跳转到appStore评分参数为{appId:'appId'} (PS:如果是android appId为应用程序包名) 例子openUri('appStore', 'appId', {});
   */
  openUri: (typeStr, uriVal, argsObj, onSuccess, onFail) => {
    const type = typeStr || ''
    const uri = uriVal || ''
    const args = argsObj || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'CommonTools', 'openUri', [
          type,
          uri,
          args
        ])
      },
      2000
    )
  },

  /**
   * APP内部浏览器打开页面(只有IOS支持)
   * @param {Object} options 参数
   * {"url":"路径","title" :'标题'}
   */
  openUrl: (options, onSuccess, onFail) => {
    const url = options.url || ''
    const title = options.title || ''
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'CommonTools', 'openUrl', [
          url,
          title
        ])
      },
      2000
    )
  },

  /*
   * 与客户端交互请求时间戳
   */
  check_login_state: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools2',
          'check_login_state',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 返回native登录
   * option 为空，回到首页
   *
   * @param {Object} options 参数
   * flag 是否为单页面形式url 例如：#a/b/c
   * url 当前页面的hash值，要参数的需要带参
   * sysName 如果flag='N',则sys存在，例如life包内则 sys : "life"
   *
   * h5reload: 'Y' 返回超时页面并刷新
   *
   */
  timeoutBack: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools', 'timeoutBack', [
          option
        ])
      },
      2000
    )
  },
  /**
   * @param options
   * paeH5reload  Y H5控制刷新  N Native刷新容器
   * pageUrl  超时的页面url
   * timeoutUrl 超时的后台接口url
   */
  timeOutLogin: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'KdePlugin', 'timeOutLogin', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 获取App版本信息
   * @param {Function} onSuccess 参数
   */
  getVersionInfo: (onSuccess, onFail) => {
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools',
          'getVersionInfo',
          []
        )
      },
      2000
    )
  },

  /**
   * 跳转展E宝产品详情
   * @param {Function} onSuccess 参数
   */
  toZebProduct: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'ELifeAssist',
          'to_zeb_productStudy',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 埋点
   * @param {Object} data "event_id":"掌上宝",
   *              "event_label":"建议书预览", // 建议书分享,电子签名,选择险种,上传证件影像,投保书预览,自核
   *            "event_param":{
   *              "date":     new Date(),
   *              "docId":    docId
   *            }
   * @param {Object} onSuccess
   * @param {Object} onFail
   */
  trackPocketInsuranceEvent: (data, onSuccess, onFail) => {
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'insurance',
          'track_pocket_insurance_event',
          [data]
        )
      },
      2000
    )
  },

  /**
   * 社交云容器设置头部
   * @param options Object
   * title 头部提示
   * rightBtnText 右边文字
   * leftBtnText 左边文字
   * rightBtnClick 右边点击事件
   * leftBtnClick 左边点击事件
   */
  imChat_setHeader: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'IMChatWebViewHeader',
          'set_im_web_header',
          [option]
        )
      },
      5000
    )
  },

  /**
   * 社交云分享接口
   * @param options Object
   */
  imChat_share: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'IMChatWebViewHeader',
          'im_web_share',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 社交云h5容器关闭方法
   * @param options Object
   */
  imChat_close_webView: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'IMChatWebViewHeader',
          'exit_web',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 社交云打开新容器展示外部页面
   * @param options Object
   */
  imChat_openUrl: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'IMChatWebViewHeader',
          'open_extra_web',
          [option]
        )
      },
      2000
    )
  },
  /**
   * 关闭社交云容器
   * @param options Object
   */
  imChat_hideHeader: (options, onSuccess, onFail) => {
    const option = {
      hideHead: 'Y'
    }
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'IMChatWebViewHeader',
          'hideNativeHead',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 公众号历史消息-系统消息-查看详情
   * @param options Object
   * option {msg: {}}
   */
  jumpPublicHistory: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools2',
          'jumpPublicHistory',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 客户生日提醒--分享生日贺卡给客户
   * @param  {[object]} options
   *  [param中需要：birthdayCardUrl（生日贺卡的生产链接）、title（微信上看到的标题）、iconUrl(微信上看到的缩略图)、message（微信上看到的缩略语）]
   * @param  {[function]} onSuccess [调用成功的回调函数]
   * @param  {[function]} onFail    [调用native接口失败时会调用]
   */
  shareBirthdayCardToCustomer: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools2',
          'shareCardToCustomer',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 图片预览
   * @param options Object
   */
  ImageZoom: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools', 'image_zoom', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 增员指南--跳转ai语音录制Native页面--方案三
   * @param {Object} options 暂无参数
   */
  gotoAiInterviewM3: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools2',
          'gotoAiInterviewM3',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 增员指南--跳转ai语音录制Native页面--方案一
   * @param {Object} options 参数
   */
  jumpAiInterview: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools2',
          'jumpAiInterview',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 社交云消息发送
   * @param {Object} options 参数
   *  userName:xxxxx, 需要发起聊天的用户ID，如果是单聊是工号，如果是群聊或者公众号需要传递社交云的群ID或者公众号ID。如果需要选择联系人，则可传空。不需要选择联系人，必须传值。
   *  chatType:single/group/public ,   发起的聊天类型，single代表单聊，group代表群聊，public代表公众号，如果不需要选择联系人，则传空。
   *  nickName: 代表聊天对象的昵称 单聊则是对方昵称，群聊是群聊名称，公众号是公众号名称
   *  select: Y/N,          是否需要选择联系人 Y需要选择联系人 N不需要选择联系人。
   *  msgType:text/link,  需要发送的消息类型，text代表文本类型，link代表分享类型，没有需要发送的消息，传空。如果后续出现无法处理的类型，会有错误回调H5，H5需要提示用户升级新版本
   *  msgContent:xxxx
   *      需要发送消息的内容，如果是文本类型，msgContent是文本的内容；
   *      如果是分享类型，msgContent的内容是一个JSONObject {title:标题， img:缩略图url，link:需要分享的url，desc:摘要}, 如果内容解析错误会有错误回调H5
   */
  startChat: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'startChat', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 通过native方法打开新链接，链接需满足相关配置，规范各个页面的互调
   * @param options Object
   * nativeURL: 需满足特殊规则，
   *     外部链接：https://www.baidu.com/
   *     单页面： https://esales-local/h5/orphanAllot/orphanAllot/allotIndex
   *     多页面： https://esales-local/mutiple_h5/insurance/modules/appclient/index.html#enterModule
   *     native: https://esales-local/native/facecheck
   *     zeb： https://esales-local/zeb?sub_type=P&related_id=xx
   * resourceSys: url 当前调用的系统, pub、life、zeb，native做记录用
   * option {nativeURL: ''}
   */
  to_native_page: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'to_native_page', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 跳转千人千面通关、演练界面
   * options.screenplayId   剧本ID
   * options.continueFlag   继续考试标识
   * options.channel        来源渠道
   * options.idCompletionPersonMatch   人卷匹配表主键
   */
  jumpVoicePractice: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools2',
          'jumpVoicePractice',
          [option]
        )
      },
      2000
    )
  },
  /**
   * 加油站已选课程跳转直播间
   * options.atendeeJoinUrl   直播间链接
   * options.roomId           直播间ID
   * options.atendeeToken     加入口令
   * options.studentName      昵称（姓名）
   * options.roleNo           角色
   */
  gsFastRelease: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'gsFastRelease', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 任务助手——获取消息任务列表
   * options.data_type        数据类型（ 1：待办tab选中  2：全部tab选中）
   * options.data_category    数据分类
   * options.pageNum          第几页
   * options.pageSize         每页查询的条目
   */
  getMsgTaskList: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'getMsgTaskList', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 任务助手——更新消息状态
   * options.msg_id           消息ID
   * options.empno            消息所属人工号
   * options.message_status   消息状态
   */
  updateMsgStatus: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'updateMsgStatus', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 任务助手——加入日程
   * options.msg_id                  消息ID
   * options.empno                   消息所属人工号
   * options.addScheduleMethodType   添加日程方式(0:直接添加，1：跳转到Native添加)
   */
  addSchedule: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'addSchedule', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 扫描二维码
   * options.type="scanCode"         标志
   */
  scanQrCode: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'scan_qr_code', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 千人千面－开始录音
   */
  startRecord: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'start_record', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 千人千面－结束录音
   */
  endRecord: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'end_record', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 任务助手——更新本地日程
   * options.scheduleTitle             日程标题
   * options.dataCategory              日程文字类型
   * options.scheduleStart             带毫秒始时间时间戳
   * options.scheduleEnd               带毫秒结束时间时间戳
   * options.allDay                    是否是全天
   * options.scheduleAheadTime         多久前开始提醒
   * options.scheduleContent           提醒事项
   * options.isLocalSchedule           Y为本地日程、N为系统日程
   * options.scheduleId                日程ID,系统日程取msg_id
   * options.empno                     如果是系统日程，需要
   *
   */
  addScheduleNoTime: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        //  console.log('============ addScheduleNoTime')
        window.cordova.exec(onSuccess, onFail, 'backlog', 'addScheduleNoTime', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 任务助手——更新本地日程
   * options.msg_id                    消息id
   * options.empno                     消息所属人工号
   * options.scheduleTitle             日程标题
   * options.dataCategory              日程文字类型
   * options.scheduleStart             带毫秒始时间时间戳
   * options.scheduleEnd               带毫秒结束时间时间戳
   * options.allDay                    是否是全天
   * options.scheduleAheadTime         多久前开始提醒
   */
  updateSchedule: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'updateSchedule', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 任务助手——删除本地日程
   * options.scheduleID     本地日程唯一标识
   */
  deleteSchedule: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'deleteSchedule', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 任务助手——查找本地日程
   * options.year     年份
   * options.month    月份
   *
   */
  findSchedule: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'findSchedule', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 任务助手——查找本地日程
   * options.year     年份
   * options.month    月份
   *
   */
  findScheduleByID: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'findScheduleByID', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 获取环境InterFace值
   * param:
   *  @param {Function} onSuccess回调参数:
   *      return param 无
   *  @param {Function} onFail回调参数:
   *      return param {String} errorMsg 失败详情
   */
  getEnvironmentAndEntrance: (onSuccess, onFail) => {
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools',
          'getEnvironmentAndEntrance',
          []
        )
      },
      2000
    )
  },
  /**
   * AI助理--说明页的跳转 通过native方法打开新的页面
   * onSuccess 成功回调参数;
   * onFail 失败回调参数: return param {String} errorMsg 失败详情
   * options.question 问题 string类型
   * options.questionType “00” 问题类型00用户问题，01机器人问题，string类型
   */
  aiAssistantHotQuestion: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools2',
          'aiAssistantHotQuestion',
          [option]
        )
      },
      2000
    )
  },
  /**
   * AI助理--任务助手跳转欢迎页 通过native方法打开新的页面
   * onSuccess 成功回调参数;
   * onFail 失败回调参数: return param {String} errorMsg 失败详情
   * options.nativeLocalUrl 跳转路径
   */
  jumpNativeMenu: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'jumpNativeMenu', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 任务助手 —— 代办任务，是否加入日程
   * options.msg_id 消息id
   */
  isScheduleAdd: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'isScheduleAdd', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 智能语音--播放答案录音
   * options.position   要播放的录音的题号（传：1|2|3|4。。。等）
   */
  playPracticeAudio: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools2',
          'playPracticeAudio',
          [option]
        )
      },
      2000
    )
  },
  /**
   * 智能语音--停止答案录音的播放
   * （不用传参数）
   */
  stopPracticeAudio: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools2',
          'stopPracticeAudio',
          [option]
        )
      },
      2000
    )
  },
  /**
   * 跳转及时通讯-公司公众号列表
   * @param {Object} options 暂无参数
   */
  jumpToPublic: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'jumpToPublic', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 新版E锦囊入口(进入native的线索列表页面)
   */
  toSalesLeadPro: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'insurance', 'toSalesLeadPro', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 去展E宝
   */
  ToElife: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'gotoZEB', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 扫描身份证
   * options：{
   *    imageW(图片宽度) 默认400
   *    imageH（图片高度）默认400
   *    quality（图片质量）默认90
   *    maxCerImg（限制图片大小）默认300*1024
   *    ocrImageKey（图片保存文件名）
   * }
   * onSuccess回调参数data:{
   *    idName（姓名）
   *    idBirth（出生日期）
   *    idAddress（地址）
   *    idRace（名族）
   *    idSerial（身份证号）
   *    idSex（性别）
   *    idSinedDepartment（发证机关）
   *    idValidDate（有效日期）
   * }
   */
  scanIDCard: (options = {}, onSuccess = () => {}, onFail = () => {}) => {
    // 参数需要string类型
    options.imageW = options.imageW || '400'
    options.imageH = options.imageH || '400'
    options.quality = options.quality || '90'
    options.maxCertImg = options.maxCertImg || `${300 * 1024}`
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'IDCardScanner', 'scanIDCard', [
          options
        ])
      },
      2000
    )
  },
  /**
   * 展示水印
   */
  showWaterMark: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'showWaterMark', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 隐藏水印
   */
  hideWaterMark: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'hideWaterMark', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 截屏分享
   */
  openLongPicShare: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools2',
          'openLongPicShare',
          [option]
        )
      },
      2000
    )
  },
  /**
   * 跳转到课堂伴侣
   * @param  {[obj]} data  [domain:域名 nickName:登录名 watchPassword:观看密码 roomNumber:房间号]
   * @param  {[function]} onSuccess [callback]
   * @param  {[function]} onFail    [callback]
   * @return {[undefined]}
   */
  doubleClassrooms: (data, onSuccess, onFail) => {
    window.cordova.exec(onSuccess, onFail, 'commTools2', 'doubleClassrooms', [
      data
    ])
  },
  /* 拉起客户信息页面
   * options(传入的参数为空)
   * onSuccess(成功的回调函数，自定义一个函数用来取值)
   * onFail(失败的回调函数)
   */
  showCustomerInfo: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools2',
          'showCustomerInfo',
          [option]
        )
      },
      2000
    )
  },
  /**
    * 进入远程会议
    * options:{xx:"xx",y:"yy"...}//用户参数json,
    "MeetingDomain":clientUrl,////域名
    "MeetingHomeNum":$(e.target).attr("roomNo"),//直播间房间号
    "MeetingHomeId":$(e.target).attr("roomId"),//直播间房间ID
    "MeetingPassNum":$(e.target).attr("password"),//密码
    "MeetingPerson":$(e.target).attr("userName"),//在直播间显示的名字
    "MeetingRole":$(e.target).attr("role"),//用户角色
    "MeetingName":$(e.target).attr("meetingName"),//会议名称
  */
  enterMeeting: (options, onSuccess, onFail) => {
    options = options || {}
    window.cordova.exec(onSuccess, onFail, 'MeetingDomain', 'enterMeeting', [
      options
    ])
  },
  /**
   * 容器间通信 20190218 liuhui651添加 native新方法
   */
  communication: (options, onSuccess, onFail) => {
    options = options || {}
    window.cordova.exec(onSuccess, onFail, 'commTools2', 'communication', [
      options
    ])
  },
  /**
   * 容器间通信-获取数据 20190218 liuhui651添加 native新方法
   */
  getCommuicationData: (options, onSuccess, onFail) => {
    options = options || {}
    window.cordova.exec(
      onSuccess,
      onFail,
      'commTools2',
      'getCommuicationData',
      [options]
    )
  },
  /**
   * 容器间通信-删除数据 20190218 liuhui651添加 native新方法
   */
  deleteCommuicationData: (options, onSuccess, onFail) => {
    options = options || {}
    window.cordova.exec(
      onSuccess,
      onFail,
      'commTools2',
      'deleteCommuicationData',
      [options]
    )
  },

  /**
   * 任务中心 —— 类型筛选列表
   * 无参
   */
  startBackTaskHistory: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'backlog',
          'startBackTaskHistory',
          [option]
        )
      },
      2000
    )
  },
  /**
   * 任务中心 —— 待办、超时
   * options.taskTypes:['00','01'] “00”代表待办，”01”代表超时
   * options.taskLabels:[“001”,”002”] 可查询多个标签类型，如果为[]，则查询全部标签
   */
  getTaskHistory: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'getTaskHistory', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 任务中心 —— 已完成
   * options.pageSize:'30', 每页条数
   * options.pageNo:'1' 页码
   */
  getTaskDone: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'getTaskDone', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 任务中心 —— 清空对应模板id的未读数
   * options.templateIds:[“xxxxx”]
   */
  clearUnreadMsg: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'clearUnreadMsg ', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 任务中心 —— 已读方法
   * options.templateIds:[“xxxxx”]
   */
  readTask: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'readTask', [option])
      },
      2000
    )
  },
  /**
   * 日历筛选 —— 已读方法
   * options.fistTime  初始 时间戳（0点 ）
   * options.lastTime 结尾事件戳 （ 23点。59分，59秒.999毫分）
   */
  calendTask: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'calendTask', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 关闭native容器时弹出调研问卷窗口
   */
  handleQuestionnaireSurvey: (options, onSuccess, onFail) => {
    const option = options || {}
    const ua = window.navigator.userAgent.toLocaleLowerCase()
    if (ua.indexOf('questionnairesurvey') !== -1) {
      window.cordova.exec(
        onSuccess,
        onFail,
        'insurance',
        'handleQuestionnaireSurvey',
        [option]
      )
    } else if (onSuccess) onSuccess()
  },
  /**
   * 改变状态栏
   * options  text_color_is_white 状态栏文字颜色，Y白色，N黑色   background_color 背景色 #ffffff
   *
   * onSuccess(成功的回调函数，自定义一个函数用来取值)
   * onFail(失败的回调函数)
   */
  modifyStatusBar: (options, onSuccess, onFail) => {
    // const bgArr = ['#ffffff', '#fff', '#ff6000']
    // if (options && options.background_color
    //  && bgArr.includes(options.background_color.toLocaleLowerCase())) return
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'ELifeAssist',
          'modify_status_bar',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 任务中心 -- h5通知native拉取后台数据
   */
  h5LoadTask: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'h5LoadTask', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 任务中心 -- 置顶
   */
  h5OrderNoToTop: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'h5OrderNoToTop', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 任务中心 -- 查询日程和任务
   * options.fistTime  初始 时间戳（0点 ）
   * options.lastTime 结尾事件戳 （ 23点。59分，59秒.999毫分）
   */
  getH5CalendAndSchedule: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'backlog',
          'getH5CalendAndSchedule',
          [option]
        )
      },
      2000
    )
  },
  /**
   * 任务中心 -- 保存或添加日程 格式 {templateNo...}
   * templateNo: '' // 模版号
   * mission_id: '' // 唯一标志该任务
   * mission_start_date: '' // 日程开始时间
   * mission_end_date: '' //日程结束时间
   * operateType: '' // 操作类型，I表示新增，U表示更新
   * mission_status: '' // Y表示有效、N表示已取消
   * label: '' // 日程名称
   */
  addCalendSchedule: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'addCalendSchedule', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 任务中心 -- 删除日程 格式 [{templateNo...}]
   * [templateNo: '' // 模版号
   * mission_id: '' // 唯一标志该任务
   */
  deleteCalendSchedule: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'backlog',
          'deleteCalendSchedule',
          [option]
        )
      },
      2000
    )
  },
  /**
   * 全屏容器 20190920
   * options isLandScape（boolean）   true:横屏   false或者不传：竖屏
   * webUrl: 地址
   * onSuccess(成功的回调函数，自定义一个函数用来取值)
   * onFail(失败的回调函数)
   */
  toNewWebView: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'toNewWebView', [
          option
        ])
      },
      2000
    )
  },
  /**
   * 聚合页数据跳转zeb
   *
   * 参数：{“jumpUrl”:” https://esales-local/zeb?xxxxx”}
   */
  fakeUrlCommonJumper: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'commTools2',
          'fakeUrlCommonJumper',
          [option]
        )
      },
      2000
    )
  },

  /**
   * 任务中心 -- 保存或添加日程
   * startDate: '' // 开始时间
   * endDate: '' // 结束时间
   */
  addNewSchedule: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'addNewSchedule', [
          option
        ])
      },
      2000
    )
  },
  /*
   * 任务中心 -- 通知native任务同步
   */
  syncBackTaskInfo: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'backlog', 'syncBackTaskInfo', [
          option
        ])
      },
      2000
    )
  },

  /**
   * 多图上传
   * @param {Object} options 参数
   * {
      tokenApi 接口
      recordId: 业务相关联的id
      bucket: iobs的存储桶，各后端系统提供
      pictureCount: 配置可选张数（多张必填，一张可不填）
      editable: 是否可编辑、
      scale: Y表示压缩，N表示不压缩
      width: 宽度
      height: 高度
    }
   * */
  palSelectPicture: (options, onSuccess, onFail) => {
    options = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(
          onSuccess,
          onFail,
          'PicturePickUp',
          'pal_selectPicture',
          [options]
        )
      },
      2000
    )
  },
  /**
   * 获取当前登录用户的密文信息
   * options.id 用户id
   */
  getShareId: (options, onSuccess, onFail) => {
    const option = options || {}
    KdeNative.execNativeMethod(
      20,
      () => {
        window.cordova.exec(onSuccess, onFail, 'commTools2', 'getShareId', [
          option
        ])
      },
      2000
    )
  },

  // native上报 Logan日志
  setLogan: (options, onSuccess, onFail) => {
    const option = options || {}
    window.cordova.exec(onSuccess, onFail, 'KdePlugin', 'logan', [option])
  },
  // H5网络请求报错监控, 调用native方法上报 7.12版本以后支持
  appMonitoringInfo: (options, onSuccess, onFail) => {
    const option = options || {}
    if (appVersion < 7.12) {
      return
    }
    console.log('============ appMonitoringInfo')
    window.cordova.exec(onSuccess, onFail, 'KdePlugin', 'appMonitoringInfo', [
      option
    ])
  }
}

export default KdeNative
