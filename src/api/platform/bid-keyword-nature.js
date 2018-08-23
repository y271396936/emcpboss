import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/platform/bid-keyword-nature'

const URL = '/rest/boss/platform/bid-keyword-natures'

const OPERATE_URL = '/rest/boss/platform/bid-keyword-natures/{id}'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({form}, cb) {
    let postData = convert.toStringify(form, FormArgument)
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  modify ({id, form}, cb) {
    let putData = convert.toJson(form, FormArgument)
    http.put(OPERATE_URL.replace('{id}', id), putData, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
