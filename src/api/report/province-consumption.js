import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/province-consumption'

const DAILY_URL = '/rest/boss/report/province-consumptions/daily'
const MONTH_URL = '/rest/boss/report/province-consumptions/month'
const PIE_URL = '/rest/boss/report/province-consumptions/pie'

export default {
  listDaily ({search}, cb) {
    http.get(DAILY_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listMonth ({search}, cb) {
    http.get(MONTH_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getPie ({search}, cb) {
    http.get(PIE_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
