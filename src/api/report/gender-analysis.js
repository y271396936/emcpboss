/**
 * Created by Heqi on 2018/6/28.
 */
import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/gender-analysis'

const URL = '/rest/boss/report/gender-reports/sex-datas'

export default {
  selectAll ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
