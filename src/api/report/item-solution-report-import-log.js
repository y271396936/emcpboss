import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/item-solution-report-import-log'

const URL = '/rest/boss/report/item-solution-report-import-logs'
const ROLLBACK_URL = '/rest/boss/report/item-solution-report-import-logs/{id}'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  rollback ({id}, cb) {
    http.delete(ROLLBACK_URL.replace('{id}', id)).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
