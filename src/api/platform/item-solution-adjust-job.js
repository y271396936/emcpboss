import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument } from '@/models/platform/item-solution-adjust-job'

const URL = '/rest/boss/platform/item-solution-adjust-jobs'
// const OPERATE_URL = '/rest/boss/platform/item-solution-adjust-jobs/{id}'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, {})
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({form}, cb) {
    let postData = convert.toStringify(form, FormArgument)
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
