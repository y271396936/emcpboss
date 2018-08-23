import http from '@/utils/http'

const URL = '/rest/support/form-tokens'

export default {
  create (cb) {
    http.post(URL).then(response => cb(response))
    .catch(trace => cb(trace.response))
  }
}
