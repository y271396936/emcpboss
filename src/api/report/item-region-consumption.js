import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/item-region-consumption'

const URL = '/rest/boss/report/item-region-consumptions/region'
const DAILY_URL = '/rest/boss/report/item-region-consumptions/daily-data'
const MONTH_URL = '/rest/boss/report/item-region-consumptions/month-data'
const HISTOGRAM_URL = '/rest/boss/report/item-region-consumptions/histogram-data'
const PROVINCE_URL = '/rest/boss/report/item-region-consumptions/province-pie-data'
const CITY_URL = '/rest/boss/report/item-region-consumptions/province-city-pie-data'
const PROVINCE_URL1 = '/rest/boss/report/item-region-consumptions/province'
const ANALYSIS_URL = '/rest/boss/report/item-region-consumptions/information-region'
const PLATFORM_CITY_URL = '/rest/boss/report/item-region-consumptions/platform-city-pie-data'
const PLATFORM_PROVINCE_URL = '/rest/boss/report/item-region-consumptions/platform-province-pie-data'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listAnalysis ({search}, cb) {
    http.get(ANALYSIS_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listProvince ({search}, cb) {
    http.get(PROVINCE_URL1, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listDaily ({search}, cb) {
    http.get(DAILY_URL, {
      params: {
        year: search.date.split('-')[0],
        month: search.date.split('-')[1],
        itemTitle: search.itemTitle,
        province: search.province,
        city: search.city,
        dataGroup: search.dataGroup,
        page: search.page,
        type: search.type,
        pageSize: search.pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listMonth ({search}, cb) {
    http.get(MONTH_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getHistogram ({search}, cb) {
    http.get(HISTOGRAM_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getProvincePie ({search}, cb) {
    http.get(PROVINCE_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getCityPie ({search}, cb) {
    http.get(CITY_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getPlatformProvincePie ({search}, cb) {
    http.get(PLATFORM_PROVINCE_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getPlatformCityPie ({search}, cb) {
    http.get(PLATFORM_CITY_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
