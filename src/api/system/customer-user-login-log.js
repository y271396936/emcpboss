import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/platform/customer-user-login-log'

const LOGIN_ANALYSIS_URL = '/rest/boss/system/customer-user-login-logs'
const SUMMARY_URL = 'rest/boss/system/customer-user-login-logs/analysis'

export default {
  getAnalysis ({search}, cb) {
    http.get(LOGIN_ANALYSIS_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getSummary ({search}, cb) {
    http.get(SUMMARY_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
