import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/platform/industry-negative-keyword'

const URL = '/rest/boss/platform/industry-negative-keywords'

const OPERATE_URL = '/rest/boss/platform/industry-negative-keywords/{id}'

const DELETE_NEGATIVE_URL = '/rest/boss/platform/item-industries/{id}/negative-keywords'

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
  deleteNegativeStrategy ({id, form}, cb) {
    const data = convert.toStringify(form, FormArgument)
    http.post(DELETE_NEGATIVE_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
