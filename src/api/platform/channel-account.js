import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/platform/channel-account'

const URL = '/rest/boss/platform/channel-accounts'
const LIKENESS_URL = '/rest/boss/platform/channel-accounts/likenesses'
const OPERATE_URL = '/rest/boss/platform/channel-accounts/{id}'
const PASSWORD_URL = '/rest/boss/platform/channel-accounts/{id}/passwords'
const STATUS_URL = '/rest/boss/platform/channel-accounts/{id}/status'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  likeness ({search}, cb) {
    http.get(LIKENESS_URL, {
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
  password ({id}, cb) {
    http.get(PASSWORD_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  modifyPassword ({id, password}, cb) {
    http.put(PASSWORD_URL.replace('{id}', id), {
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  modifyStatus ({id, status}, cb) {
    http.put(STATUS_URL.replace('{id}', id), {
      status: status
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
