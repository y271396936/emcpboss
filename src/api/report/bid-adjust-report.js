import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument, LogSearchArgument } from '@/models/report/bid-adjust-report'

const URL = '/rest/boss/report/bid-adjust-reports'
const LOG_URL = '/rest/boss/report/bid-adjust-reports/job-logs'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listLog ({search}, cb) {
    http.get(LOG_URL, {
      params: convert.toJson(search, LogSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
