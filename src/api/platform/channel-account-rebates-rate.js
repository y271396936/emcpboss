import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/platform/channel-account-rebates-rate'

const URL = '/rest/boss/platform/channel-account-rebates-rates'
const OPERATE_URL = '/rest/boss/platform/channel-account-rebates-rates/{id}'
const CHANGLOG_URL = 'rest/boss/platform/channel-account-rebates-rates/changLog/{id}'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  changLogList ({id, search}, cb) {
    http.get(CHANGLOG_URL.replace('{id}', id), {
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
  modify ({id, form, originRate}, cb) {
    const data = convert.toJson(form, FormArgument)
    data.originRate = originRate
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
