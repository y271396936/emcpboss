/**
 *Created by Heqi on 2018/1/12.
 */

import http from '@/utils/http'
import Qs from 'qs'

const URL = '/rest/boss/platform/cdn-refresh-logs'

export default {
  list ({pageUrl, operator, result, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        pageUrl: pageUrl,
        operator: operator,
        result: result,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({token, pageUrl, refreshType}, cb) {
    let postData = Qs.stringify({
      token: token,
      pageUrl: pageUrl,
      refreshType: refreshType
    })
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
