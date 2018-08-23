/**
 *Created by Heqi on 2018/5/7.
 */

import http from '@/utils/http'

const URL = '/rest/boss/backup/item-region-consumptions/list'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: {
        startTime: search.startTime,
        endTime: search.endTime,
        itemTitle: search.itemTitle,
        channelAccountName: search.channelAccountName,
        province: search.province,
        city: search.city,
        type: search.type,
        industry: search.industry,
        dataGroup: search.dataGroup,
        orderBy: search.orderBy,
        page: search.page,
        pageSize: search.pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
