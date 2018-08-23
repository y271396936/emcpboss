import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { OrientationFormentArgument } from '@/models/platform/item-orientation'

const URL = '/rest/boss/platform/item-orientations'
const OPERATE_URL = '/rest/boss/platform/item-orientations/{id}'

export default {
  get ({id}, cb) {
    http.get(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({form}, cb) {
    let postData = convert.toStringify(form, OrientationFormentArgument)
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  update ({id, form}, cb) {
    const data = convert.toJson(form, OrientationFormentArgument)
    http.put(OPERATE_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
