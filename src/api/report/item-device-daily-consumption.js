/**
 * Created by PC on 2018/1/4.
 */
import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { PlatformSearchArgument } from '@/models/report/item-device-daily-consumption'

const URL = '/rest/boss/report/item-platform-consumptions/daily-data'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, PlatformSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
