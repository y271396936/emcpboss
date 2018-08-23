import http from '@/utils/http'
import convert from '@/utils/model-convert'

import { SearchArgument } from '@/models/platform/kf53-chat-record-import-log'
const URL = '/rest/boss/report/kf53-chat-record-import-logs'

const OPERATE_URL = '/rest/boss/report/kf53-chat-record-import-logs/{id}'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
