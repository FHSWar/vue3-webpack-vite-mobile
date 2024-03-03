// @ts-nocheck

/* 埋点 */
import { createScript, isIntranet } from '@/utils'

// 定义埋点基础变量，避免页面刚进入加载报错
window.TrackPoint = {
	routeReportData() {},
	collectEvent() {},
	pageExtendData() {},
	pageStart() {},
	pageChange() {},
	setConfig() {}
}

const initEventTracking = () => {
	// 区分内外网，加载埋点sdk
	const trackpointSrc = isIntranet
		? 'https://pss-esales-cms.paic.com.cn/appStatic/esales-jslib/trackpoint/trackpoint-sdk.v2.9.js'
		: 'https://salescmscdn.pa18.com/appStatic/esales-jslib/trackpoint/trackpoint-sdk.v2.9.js'

	// 加载依赖后执行设置
	createScript(trackpointSrc).then(
		() => {
			window.TrackPoint.setConfig({
				showAlert: false // 页面没定义埋点是否提示
			})
		},
		(err) => {
			console.log('埋点文件加载出错', err)
		}
	)
}

export default initEventTracking
