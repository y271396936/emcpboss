import http from '@/utils/http'

const URL = '/rest/boss/platform/bid-keyword-categories/allItem'

export default {
  list (cb) {
    http.get(URL).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
