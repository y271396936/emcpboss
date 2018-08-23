import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument, FormArgument } from '@/models/report/item-solution-time-node'

const URL = '/rest/boss/report/item-solution-time-node-reports'
const OPERATE_URL = '/rest/boss/report/item-solution-time-node-reports/{id}'

export default {
  list ({search}, cb) {
    http.get(URL, {
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
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
