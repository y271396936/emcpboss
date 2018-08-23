import http from '@/utils/http'
const LIST_URL = '/rest/common/platforms'
const LIST_CHANNEL_URL = '/rest/common/platforms/{id}/channels'

export default {
  list (cb) {
    http.get(LIST_URL).then(response => cb(response))
    .catch(trace => cb(trace.response))
  },
  channels ({id}, cb) {
    let url = LIST_CHANNEL_URL.replace('{id}', id)
    http.get(url).then(response => cb(response))
    .catch(trace => cb(trace.response))
  }
}
