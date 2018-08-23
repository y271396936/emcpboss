import http from '@/utils/http'
import convert from '@/utils/model-convert'

import { SearchArgument } from '@/models/feedback/brand-optimization-page-click'
const URL = '/rest/boss/feedback/reservation-service'

const OPERATE_URL = '/rest/boss/feedback/reservation-service/{id}/delete'

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
