import http from '@/utils/http'

const URL = '/rest/boss/feedback/feedbacks/statistics'

export default {
  list ({date, itemTitle, regulator, channelTitle, accountTitle, industry, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        startTime: date[0],
        endTime: date[1],
        itemTitle: itemTitle,
        regulator: regulator,
        channelTitle: channelTitle,
        accountTitle: accountTitle,
        industry: industry,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
