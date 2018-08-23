import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {
  FormArgument, SearchArgument
} from '@/models/platform/train-industry-information'

const URL = '/rest/boss/platform/Industory-Information'
const DELETE_URL = '/rest/boss/platform/Industory-Information/{id}'

export default {
  insert ({form}, cb) {
    let postData = convert.toStringify(form, FormArgument)
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(DELETE_URL.replace('{id}', id))
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  // 修改
  modify ({form}, cb) {
    let data = convert.toJson(form, FormArgument)
    http.put(URL, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
