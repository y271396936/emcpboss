import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument } from '@/models/system/system-department'

const URL = '/rest/boss/system/system-departments'
const OPERATE_URL = '/rest/boss/system/system-departments/{id}'
const CHILD_URL = '/rest/boss/system/system-departments/{id}/child-departments'
const USER_URL = '/rest/boss/system/system-departments/{pid}/users'
const ROLE_URL = '/rest/boss/system/system-departments/{pid}/roles'

export default {
  listChild ({pid}, cb) {
    http.get(CHILD_URL.replace('{id}', pid)).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listUser ({pid}, cb) {
    http.get(USER_URL.replace('{pid}', pid)).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listRole ({pid}, cb) {
    http.get(ROLE_URL.replace('{pid}', pid)).then(response => cb(response)).catch(trace => cb(trace.response))
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
  }
}
