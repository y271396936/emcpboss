import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/nature-consumption'

const DAILY_URL = '/rest/boss/report/nature-consumptions/daily-data'
const MONTH_URL = '/rest/boss/report/nature-consumptions/month-data'
const PIE_URL = '/rest/boss/report/nature-consumptions/month-pie-data'

export default {
  listDaily ({search}, cb) {
    http.get(DAILY_URL, {
      params: {
        year: search.date.split('-')[0],
        month: search.date.split('-')[1],
        page: search.page,
        pageSize: search.pageSize
      }
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
