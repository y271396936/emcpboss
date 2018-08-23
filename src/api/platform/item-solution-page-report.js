import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {FormArgument, SearchArgument} from '@/models/platform/item-solution-page-report'

const URL = '/rest/boss/report/item-solution-page-reports'
const OPERATE_URL = '/rest/boss/report/item-solution-page-reports/{id}'
const DEVICE_URL = '/rest/boss/report/item-solution-page-reports/device-data'
const FEEDBACK_URL = '/rest/boss/report/item-solution-page-reports/{id}/feedbacks'
const YESTERDAY_URL = '/rest/boss/report/item-solution-page-reports/yesterday-effect'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listDevice ({search}, cb) {
    http.get(DEVICE_URL, {
      params: convert.toJson(search, SearchArgument)
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
  modifyFeedback ({id, form}, cb) {
    const data = convert.toJson(form, FormArgument)
    http.put(FEEDBACK_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  yesterdayEffect (cb) {
    http.get(YESTERDAY_URL)
      .then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
