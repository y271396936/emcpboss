/**
 * Created by yh on 2018/1/4.
 */

import http from '@/utils/http'

const URL = '/rest/boss/report/channel-account-consumptions/month-data'

export default {
  list ({year, dataType, platformId, genre, name, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        year: year,
        dataType: dataType,
        platformId: platformId,
        accountGenre: genre,
        accountTitle: name,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
