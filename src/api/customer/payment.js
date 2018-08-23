/**
 *Created by Heqi on 2018/1/18.
 */

import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/customer/payment'

const URL = '/rest/customer/platform/payments'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
