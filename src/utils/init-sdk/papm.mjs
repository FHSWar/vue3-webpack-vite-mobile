// @ts-nocheck

/* papm 性能监控 */
import {
	createScript,
	isDevEnv,
	isIntranet,
	isPrd,
	isTest,
	isWx
} from '@/utils'

// eslint-disable-next-line
const PRD_URL =
	'https://salescmscdn.pa18.com/as/kde-common-vue/assets/js/palife-tracker-esales/1.4.7/palife-tracker.min.js'
// eslint-disable-next-line
const TEST_URL =
	'https://pssdevopsbd.pa18.com/stg1/as/kde-common-vue/assets/js/palife-tracker-esales/1.4.7/palife-tracker-dev.js'

const initPAPMTracking = () => {
	window.PARS_TRACKER_ENV = isPrd ? 'prod' : 'test'
	if (!isWx && !isIntranet && !isDevEnv) {
		if (isPrd) {
			createScript(PRD_URL)
		} else if (isTest) {
			createScript(TEST_URL)
		}
	}
}

export default initPAPMTracking
