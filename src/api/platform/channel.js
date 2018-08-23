import http from '@/utils/http'
import Qs from 'qs'

const URL = '/rest/boss/platform/channels'
const OPERATE_URL = '/rest/boss/platform/channels/{id}'

export default {
  list ({platformId, status, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        platformId: platformId,
        status: status,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({token, platformId, title, status, typeId}, cb) {
    let postData = Qs.stringify({
      token: token,
      platformId: platformId,
      title: title,
      status: status,
      typeId: typeId
    })
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  modify ({id, platformId, title, status, typeId}, cb) {
    http.put(OPERATE_URL.replace('{id}', id), {
      platformId: platformId,
      title: title,
      status: status,
      typeId: typeId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => cb(response))
    .catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
