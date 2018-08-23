import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {FormArgument, SearchArgument} from '@/models/platform/item-solution-bid-review'

const URL = '/rest/boss/platform/item-solution-bid-review'
const BIDREVIEW_URL = '/rest/boss/platform/item-solution-bid-review/{id}'
const APPROVAL_URL = '/rest/boss/platform/item-solution-bid-review/{id}/approvals'
const HISTORY_URL = '/rest/boss/platform/item-solution-bid-review/review-histories'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, {})
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getHistory ({search}, cb) {
    http.get(HISTORY_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({form}, cb) {
    const data = convert.toStringify(form, FormArgument)
    http.post(URL, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  update ({id, form}, cb) {
    const data = convert.toJson(form, FormArgument)
    http.put(BIDREVIEW_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  approval ({id, form}, cb) {
    const data = convert.toStringify(form, FormArgument)
    http.post(APPROVAL_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
