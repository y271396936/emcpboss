import http from '@/utils/http'

const URL = '/rest/boss/report/account-keyword-consumptions'

export default {
  list ({date, itemTitle, account, industry, dataGroup, orderBy, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        startTime: date[0],
        endTime: date[1],
        itemTitle: itemTitle,
        accountTitle: account,
        industry: industry,
        dataGroup: dataGroup,
        orderBy: orderBy,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
