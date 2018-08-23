import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {FormArgument, SearchArgument} from '@/models/platform/classification-management'

const URL = '/rest/boss/platform/category'
const MODIFY_URL = '/rest/boss/platform/category/{id} '

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
    let data = convert.toJson(form, FormArgument)
    http.put(MODIFY_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(MODIFY_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
