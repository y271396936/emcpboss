import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/platform/item-solution-site'

const URL = '/rest/boss/platform/item-solution-sites'
const OPERATE_URL = '/rest/boss/platform/item-solution-sites/{id}'
const STATUS_URL = '/rest/boss/platform/item-solution-sites/{id}/page-status'

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
    if (data.pageType === 1) {
      data.pageType = 2
    } else if (data.pageType === 2) {
      data.pageType = 1
    }
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
  check ({id}, cb) {
    http.get(STATUS_URL.replace('{id}', id)).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
