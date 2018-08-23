import http from '@/utils/http'

const URL = '/rest/boss/report/search-keyword-consumptions'

export default {
  list ({date, title, account, industry, keyword, dataGroup, orderBy, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        startTime: date[0],
        endTime: date[1],
        title: title,
        accountTitle: account,
        industry: industry,
        SearchKeyword: keyword,
        dataGroup: dataGroup,
        orderBy: orderBy,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
