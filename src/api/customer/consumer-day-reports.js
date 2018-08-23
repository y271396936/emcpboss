/**
 *Created by Heqi on 2018/1/17.
 */

import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/customer/consumer-day-reports'

const URL = '/rest/customer/report/item-consumption-statistics/dailies'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
