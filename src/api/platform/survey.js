import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {FormArgument, SearchArgument} from '@/models/platform/survey'

const URL = '/rest/boss/platform/surveys'
const ID_URL = '/rest/boss/platform/surveys/{id}'
const REFRESH_URL = '/rest/boss/platform/surveys/{key}/key'
const BINDING_URL = '/rest/boss/platform/surveys/{id}/item/{itemId}'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({form}, cb) {
    const data = convert.toStringify(form, FormArgument)
    http.post(URL, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(ID_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // 刷新过期时间
  refresh ({key}, cb) {
    http.put(REFRESH_URL.replace('{key}', key))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // 关闭URL访问权限
  shutdown ({key}, cb) {
    http.delete(REFRESH_URL.replace('{key}', key))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // 同步数据到对应项目
  binding ({id, itemId}, cb) {
    http.put(BINDING_URL.replace('{id}', id).replace('{itemId}', itemId))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
