/**
 *Created by Heqi on 2018/1/17.
 */

import http from '@/utils/http'

const URL = '/rest/customer/system/home-pages/weather'

export default {
  list (cb) {
    http.get(URL).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
