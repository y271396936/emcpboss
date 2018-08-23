import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {FormArgument, SearchArgument} from '@/models/platform/item-solution-budget-petition'

const URL = '/rest/boss/platform/item-solution-budget-petitions'
const APPROVAL_URL = '/rest/boss/platform/item-solution-budget-petitions/{id}'
const REPULSE_URL = '/rest/boss/platform/item-solution-budget-petitions/{id}/repulses'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  approve ({id, form}, cb) {
    let postData = convert.toJson(form, FormArgument)
    http.put(APPROVAL_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  repulse ({id, repulseReason}, cb) {
    let postData = convert.toStringify({reason: repulseReason}, FormArgument)
    http.post(REPULSE_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
