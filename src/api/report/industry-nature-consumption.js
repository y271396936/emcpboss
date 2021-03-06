import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/industry-nature-consumption'

const URL = '/rest/boss/report/industry-nature-consumptions/month-data'
const HISTOGRAM_URL = '/rest/boss/report/industry-nature-consumptions/histogram-data'
const PIE_URL = '/rest/boss/report/industry-nature-consumptions/pie-data'

export default {
  list ({search}, cb) {
    http.get(URL, {
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
