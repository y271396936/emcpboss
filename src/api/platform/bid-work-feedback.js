import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {
  FormArgument,
  SearchArgument
} from '@/models/platform/bid-work-feedback'

const URL = '/rest/boss/platform/bid-work-feedbacks'
const OPERATE_URL = '/rest/boss/platform/item-solution-adjust-jobs/{id}'
const MODIFY_URL = '/rest/boss/platform/bid-work-feedbacks/{id}'
const READ_URL = '/rest/boss/platform/bid-work-feedbacks/{id}/read'

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
    http.put(MODIFY_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  modifyStatus ({id, status}, cb) {
    const data = convert.toJson({read: status}, FormArgument)
    http.put(READ_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  amend ({id, form}, cb) {
    http.put(OPERATE_URL.replace('{id}', id), form, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
