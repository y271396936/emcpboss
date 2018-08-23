
import http from '@/utils/http'

const URL = '/rest/boss/report/effect-reports'

export default {
  list ({date, channel, clientId, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        startTime: date[0],
        endTime: date[1],
        channelTitle: channel,
        clientId: clientId,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
