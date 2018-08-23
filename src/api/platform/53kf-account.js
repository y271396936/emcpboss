import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/platform/53kf-account'

const URL = '/rest/boss/platform/53kf-accounts'
const OPERATE_URL = '/rest/boss/platform/53kf-accounts/{id}'
const LOGIN_URL = '/rest/boss/platform/53kf-accounts/{id}/login-urls'

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
  getUrl ({id}, cb) {
    http.get(LOGIN_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  asyncGetUrl ({id}) {
    const xhr = new window.XMLHttpRequest()
    xhr.open('GET', LOGIN_URL.replace('{id}', id), false)
    xhr.send()

    return {
      status: xhr.status,
      data: JSON.parse(xhr.responseText) || null
    }
  }
}
