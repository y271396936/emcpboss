import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/item-account-keyword-daily-consumptions'

const PIE_URL = '/rest/boss/report/item-account-keyword-daily-consumptions/pie-data'

export default {
  getPie ({search}, cb) {
    http.get(PIE_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
