import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/region-consumption'

const CITY_DAILY_URL = '/rest/boss/report/region-consumptions/daily-data'
const CITY_MONTH_URL = '/rest/boss/report/region-consumptions/month-data'
const CITY_URL = '/rest/boss/report/region-consumptions/pie-data'

export default {
  listCityDaily ({search}, cb) {
    http.get(CITY_DAILY_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listCityMonth ({search}, cb) {
    http.get(CITY_MONTH_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getCityPie ({search}, cb) {
    http.get(CITY_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
