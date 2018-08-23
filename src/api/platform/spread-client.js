import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/platform/spread-client'

const URL = '/rest/boss/platform/customers'

const OPERATE_URL = '/rest/boss/platform/customers/{id}'
// 委派
const APPOINT_URL = '/rest/boss/platform/customers/{id}/appointing'

// 获取销售和媒介
const SALER_MEDIUM_URL = '/rest/boss/system/system-users/salesman-mediators'

// 修改推广客户状态
const STATUS_URL = '/rest/boss/platform/customers/{id}/status'

const SERVICE_URL = '/rest/boss/platform/customers/{id}/services'
const OPERATE_SERVICE_URL = '/rest/boss/platform/customers/services/{id}'

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
  // 委派
  appointCustomer ({id, genre, salerId}, cb) {
    let postData = convert.toStringify({genre: genre, salerId: salerId}, FormArgument)
    http.post(APPOINT_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  salerMediumList (cb) {
    http.get(SALER_MEDIUM_URL).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  lookContacts ({id}, cb) {
    http.get(OPERATE_URL.replace('{id}', id), {}).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  modifyStatus ({id, status}, cb) {
    http.put(STATUS_URL.replace('{id}', id), {
      status: status
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listService ({id}, cb) {
    http.get(SERVICE_URL.replace('{id}', id)).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  addService ({id, serviceId}, cb) {
    let postData = convert.toStringify({serviceId: serviceId}, FormArgument)
    http.post(SERVICE_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  deleteService ({id}, cb) {
    http.delete(OPERATE_SERVICE_URL.replace('{id}', id)).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
