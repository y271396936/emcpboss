import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/platform/channel-account-coin'

const URL = '/rest/boss/platform/channel-account-coins'
const PAYMENT_URL = '/rest/boss/platform/channel-account-coins/{id}/recharging'
const CORRECT_URL = '/rest/boss/platform/channel-account-coins/{id}/adjusting-coin'
const CORRECT_LOG_URL = '/rest/boss/platform/channel-account-coins/{id}/correct-logs'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  payment ({id, form}, cb) {
    let postData = convert.toStringify(form, FormArgument)
    http.post(PAYMENT_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  correct ({id, form}, cb) {
    let postData = convert.toStringify(form, FormArgument)
    http.post(CORRECT_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getCorrectLog ({id}, cb) {
    http.get(CORRECT_LOG_URL.replace('{id}', id)).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
