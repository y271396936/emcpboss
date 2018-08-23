import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/item-channel-type-month-effect'

const TYPE_URL = '/rest/boss/report/item-channel-type-month-effects/month-pie-data'

export default {
  getTypePie ({search}, cb) {
    http.get(TYPE_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
