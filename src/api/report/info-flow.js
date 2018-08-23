import http from '@/utils/http'

const URL = '/rest/boss/report/infoFlow/list'

export default {
  list ({date, platformId, account, itemTitle, industry, orderBy, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        startTime: date[0],
        endTime: date[1],
        accountTitle: account,
        itemTitle: itemTitle,
        industry: industry,
        platformId: platformId,
        orderBy: orderBy,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
