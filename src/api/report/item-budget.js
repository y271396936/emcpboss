import http from '@/utils/http'

const URL = '/rest/boss/report/adjust-reports/item-budgets'

export default {
  list ({date, customer, itemTitle, industry, saler, server, regulatorDepartmentId, other, orderBy, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        startTime: date[0],
        endTime: date[1],
        customerTitle: customer,
        itemTitle: itemTitle,
        industry: industry,
        saler: saler,
        server: server,
        regulatorDepartmentId: regulatorDepartmentId,
        other: other,
        orderBy: orderBy,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
