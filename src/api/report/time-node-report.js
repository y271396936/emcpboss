import http from '@/utils/http'

const URL = '/rest/boss/report/item-solution-time-node-reports/analyses'

export default {
  list ({date, platformId, account, customer, itemTitle, regulatorDepartmentId, regulator, server, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        startTime: date[0],
        endTime: date[1],
        platformId: platformId,
        accountTitle: account,
        customerTitle: customer,
        itemTitle: itemTitle,
        regulatorDepartmentId: regulatorDepartmentId,
        regulator: regulator,
        server: server,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
