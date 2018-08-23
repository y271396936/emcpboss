import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SalerSearchArgument } from '@/models/report/item-daily-consumption'

const URL = '/rest/boss/report/sales-consumptions/daily-data'
const NEARLY_CONSUMPTIONS_AMOUNT_URL = '/rest/boss/report/item-consumptions/nearly-consumptions'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SalerSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  nearlyConsumptionAmount (cb) {
    http.get(NEARLY_CONSUMPTIONS_AMOUNT_URL).then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
