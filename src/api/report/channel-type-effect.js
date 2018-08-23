/**
 *Created by Heqi on 2018/3/16.
 */
import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/channel-type-effect'

const BAR_URL = '/rest/boss/report/item-channel-type-effects/bar-data'
const PIE_URL = '/rest/boss/report/item-channel-type-effects/pie-data'

export default {
  getBarData ({search}, cb) {
    http.get(BAR_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getPieData ({search}, cb) {
    http.get(PIE_URL, {
      params: {
        year: search.date.split('-')[0],
        month: search.date.split('-')[1],
        top: search.top
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
