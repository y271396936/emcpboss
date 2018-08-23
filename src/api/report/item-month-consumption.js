/**
 * Created by yh on 2018/1/4.
 */
import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/item-month-consumption'

const URL = '/rest/boss/report/item-consumptions/month-data'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
