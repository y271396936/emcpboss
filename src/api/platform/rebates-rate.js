import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/platform/rebates-rate'

const URL = '/rest/boss/platform/rebates-rates'

const OPERATE_URL = '/rest/boss/platform/rebates-rates/{id}'

// 改返点
const CHANGE_URL = '/rest/boss/platform/rebates-rates/{id}/rates'

// 返点历史记录
const HISTORY_URL = '/rest/boss/platform/rebates-rates/{id}/change-histories'

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
  // 修改返点虑
  modify ({id, rate, effectiveType}, cb) {
    http.put(CHANGE_URL.replace('{id}', id), {
      rate: rate,
      effectiveType: effectiveType
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // 变更历史
  changeHistory ({id, page, pageSize}, cb) {
    http.get(HISTORY_URL.replace('{id}', id), {
      params: {
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
