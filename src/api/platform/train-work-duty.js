import http from '@/utils/http'
import convert from '@/utils/model-convert'

import {FormArgument, SearchArgument} from '@/models/platform/train-work-duty'

const URL = '/rest/boss/platform/train-work-duty'

const OPERATOR_URL = '/rest/boss/platform/train-work-duty/{id}'

export default {
  // 列表
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // 创建
  create ({form}, cb) {
    const data = convert.toStringify(form, FormArgument)
    http.post(URL, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  update ({id, form}, cb) {
    const data = convert.toJson(form, FormArgument)
    http.put(OPERATOR_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // 删除
  delete ({id}, cb) {
    http.delete(OPERATOR_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
