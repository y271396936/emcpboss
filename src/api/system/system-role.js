import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument, FormArgument } from '@/models/system/system-role'

const URL = '/rest/boss/system/system-roles'
const PART_URL = '/rest/boss/system/system-roles/all'
const OPERATE_URL = '/rest/boss/system/system-roles/{id}'
const ADDPERM_URL = '/rest/boss/system/system-roles/{id}/perms'
const SUBMENULIST_URL = '/rest/boss/system/system-roles/{id}/perms'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  part (cb) {
    http.get(PART_URL).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  submenuList ({id}, cb) {
    http.get(SUBMENULIST_URL.replace('{id}', id)).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  addPerm ({form, id}, cb) {
    let postData = convert.toStringify(form, FormArgument)
    http.post(ADDPERM_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
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
  }
}
