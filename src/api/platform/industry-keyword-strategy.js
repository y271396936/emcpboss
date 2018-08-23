import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/platform/industry-keyword-strategy'

const URL = '/rest/boss/platform/industry-keyword-strategies'

const OPERATE_URL = '/rest/boss/platform/industry-keyword-strategies/{id}'
const OPERATE_EDIT_URL = '/rest/boss/platform/industry-keyword-strategies/{id}/keywords'

// 批量删除推广词
const DELETE_EXTENSION_URL = '/rest/boss/platform/item-industries/{id}/keyword-strategies'

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
    const data = convert.toJson(form, FormArgument)
    http.put(OPERATE_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  apply ({id}, cb) {
    http.put(OPERATE_EDIT_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  deleteExtensionStrategy ({id, form}, cb) {
    const data = convert.toStringify(form, FormArgument)
    http.post(DELETE_EXTENSION_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
