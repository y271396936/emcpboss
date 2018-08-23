import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/item-nature-consumption'

const DAILY_URL = '/rest/boss/report/item-nature-consumptions/daily-data'
const HISTOGRAM_URL = '/rest/boss/report/item-nature-consumptions/histogram-data'
const PIE_URL = '/rest/boss/report/item-nature-consumptions/pie-data'
const MONTH_URL = '/rest/boss/report/item-nature-consumptions/month-data'

export default {
  listDaily ({search}, cb) {
    http.get(DAILY_URL, {
      params: {
        year: search.date.split('-')[0],
        month: search.date.split('-')[1],
        itemTitle: search.itemTitle,
        keywordNatureTitle: search.nature,
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
  getHistogram ({search}, cb) {
    http.get(HISTOGRAM_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getPie ({search}, cb) {
    http.get(PIE_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
