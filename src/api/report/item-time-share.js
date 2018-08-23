import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/item-time-share'

const URL = '/rest/boss/report/item-time-share-consumptions'
const DAILY_URL = '/rest/boss/report/item-time-share-consumptions/daily'
const MONTH_URL = '/rest/boss/report/item-time-share-consumptions/month'
const ACCOUNTCONSUMPTIONPIE_URL = '/rest/boss/report/item-time-share-consumptions/time-share-pie'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
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
  accountConsumptionPie ({search}, cb) {
    http.get(ACCOUNTCONSUMPTIONPIE_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
