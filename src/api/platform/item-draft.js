import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/platform/client-items-draf'

const URL = '/rest/boss/platform/drafts'
const OPERATE_URL = '/rest/boss/platform/drafts/{id}'
const APPROVAL_URL = '/rest/boss/platform/drafts/{id}/consents'
const REPULSE_URL = '/rest/boss/platform/drafts/{id}/repulses'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  approve ({id}, cb) {
    http.put(APPROVAL_URL.replace('{id}', id), {})
    .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  repulse ({id, reason}, cb) {
    http.put(REPULSE_URL.replace('{id}', id), {reason: reason}, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
