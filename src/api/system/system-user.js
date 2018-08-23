import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/system/system-user'

const URL = '/rest/boss/system/system-users'
const USERLIST = '/rest/boss/system/system-users/userlist'
const OPERATE_URL = '/rest/boss/system/system-users/{id}'
const RESETPWD_URL = '/rest/boss/system/system-users/resetPwd/{id}'
const LEAVE_URL = '/rest/boss/system/system-users/{id}/leave'
const BID_SUBORDINATE_URL = '/rest/boss/system/system-users/bid-subordinates'
const SALESMAN_MEDIATOR_URL = '/rest/boss/system/system-users/salesman-mediators'
const PASSWORD_URL = '/rest/boss/system/system-users/password'
const LOGIN_LOG_URL = '/rest/boss/system/system-users/login-logs'
const USER_LIKENESS_URL = '/rest/boss/system/system-users/user-likeness'
const SALES_LIKENESS_URL = '/rest/boss/system/system-users/sales-likeness'
const OPERATOR_LIKENESS_URL = '/rest/boss/system/system-users/operator-likeness'
const SERVICE_LIKENESS_URL = '/rest/boss/system/system-users/service-likeness'
const OPTIMIZE_LIKENESS_URL = '/rest/boss/system/system-users/optimize-likeness'

export default {
  resetPwd ({id}, cb) {
    http.put(RESETPWD_URL.replace('{id}', id), {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  list ({search}, cb) {
    http.get(USERLIST, {params: convert.toJson(search, SearchArgument)}).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({form}, cb) {
    const postData = convert.toStringify(form, FormArgument)
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
  delete ({id, leaveReason}, cb) {
    let postData = convert.toStringify({leaveReason: leaveReason}, FormArgument)
    http.post(LEAVE_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  bidSubordinates (cb) {
    http.get(BID_SUBORDINATE_URL).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  salemanAndMediator (cb) {
    http.get(SALESMAN_MEDIATOR_URL).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  modifyPassword ({form}, cb) {
    const data = convert.toJson(form, FormArgument)
    http.put(PASSWORD_URL, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listLog (cb) {
    http.get(LOGIN_LOG_URL).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  userLikeness ({name}, cb) {
    http.get(USER_LIKENESS_URL, {
      params: {name: name}
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  salesLikeness ({name}, cb) {
    http.get(SALES_LIKENESS_URL, {
      params: {name: name}
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  operatorLikeness ({name}, cb) {
    http.get(OPERATOR_LIKENESS_URL, {
      params: {name: name}
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  serviceLikeness ({name}, cb) {
    http.get(SERVICE_LIKENESS_URL, {
      params: {name: name}
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  optimizeLikeness ({name}, cb) {
    http.get(OPTIMIZE_LIKENESS_URL, {
      params: {name: name}
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
