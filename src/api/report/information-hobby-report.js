import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {SearchArgument} from '@/models/report/information-hobby-report'

const URL = '/rest/boss/report/information-hobby-reports'
export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
