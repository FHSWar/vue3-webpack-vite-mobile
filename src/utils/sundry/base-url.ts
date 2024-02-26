import { isDevEnv, isPrd } from '@/utils'

const { href, origin } = window.location

const isTestIntranetStg1 =
  /(pssdevopsbd.paic.com.cn\/stg1)/.test(href) || /stg1-web-padis/.test(origin)

const isTestIntranetStg2 =
  /(pssdevopsbd.paic.com.cn\/stg2)/.test(href) || /stg2-web-padis/.test(origin)

const isTestExtranetStg1 =
  /(pssdevopsbd.pingan.com.cn\/stg1|pssdevopsbd.pa18.com\/stg1)/.test(href) ||
  /stg1-salescms/.test(origin)

const isTestExtranetStg2 =
  /(pssdevopsbd.pingan.com.cn\/stg2|pssdevopsbd.pa18.com\/stg2)/.test(href) ||
  /stg2-salescms/.test(origin)

const switchByEnv = (urlObj: {
  devUrl: string
  extraUrl1: string
  extraUrl2: string
  intraUrl1: string
  intraUrl2: string
  prdUrl: string
}) => {
  const { devUrl, extraUrl1, extraUrl2, intraUrl1, intraUrl2, prdUrl } = urlObj

  switch (true) {
    case isDevEnv:
      return devUrl
    case isTestIntranetStg1:
      return intraUrl1
    case isTestIntranetStg2:
      return intraUrl2
    case isTestExtranetStg1:
      return extraUrl1
    case isTestExtranetStg2:
      return extraUrl2
    case isPrd:
      return prdUrl
    default:
      throw new Error('不属于任何已知环境')
  }
}

export const cmsStaticUrl = switchByEnv({
  devUrl: 'https://test-stg1-salescms-paids.pa18.com',
  intraUrl1: 'https://pss-esales-cms-nginx-bx-stg1-web-padis.paic.com.cn',
  intraUrl2: 'https://pss-esales-cms-nginx-bx-stg2-web-padis.paic.com.cn',
  extraUrl1: 'https://test-stg1-salescms-paids.pa18.com',
  extraUrl2: 'https://test-stg2-salescms-paids.pa18.com',
  prdUrl: 'https://salescmscdn.pa18.com'
})

export const devOpsUrl = switchByEnv({
  devUrl: 'https://pssdevopsbd.pa18.com/stg1',
  intraUrl1: 'https://pssdevopsbd.paic.com.cn/stg1',
  intraUrl2: 'https://pssdevopsbd.paic.com.cn/stg2',
  extraUrl1: 'https://pssdevopsbd.pa18.com/stg1',
  extraUrl2: 'https://pssdevopsbd.pa18.com/stg2',
  prdUrl: 'https://salescmscdn.pa18.com'
})

export const iobsHost = switchByEnv({
  devUrl: 'http://stg.iobs.pingan.com.cn/download/pss-esales-cms-dmz-dev/',
  intraUrl1: 'http://stg.iobs.pingan.com.cn/download/pss-esales-cms-dmz-dev/',
  intraUrl2: 'http://stg.iobs.pingan.com.cn/download/pss-esales-cms-dmz-dev/',
  extraUrl1: 'http://stg.iobs.pingan.com.cn/download/pss-esales-cms-dmz-dev/',
  extraUrl2: 'http://stg.iobs.pingan.com.cn/download/pss-esales-cms-dmz-dev/',
  prdUrl: 'https://iobs.pingan.com.cn/download/pss-esales-cms-dmz-prdUrl/'
})
