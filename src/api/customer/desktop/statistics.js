import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {SearchArgument} from '@/models/customer/desktop/statistics'

const ITEM_ARREARAGE_URL = '/rest/customer/report/item-charge-statistics/item-arrearage'
const YESTERDAY_EFFECT_URL = '/rest/customer/report/item-solution-page-reports/yesterday-effect'
const BALANCE_URL = '/rest/customer/report/item-consumptions/customer-balance'
const PROMOTE_DATA_URL = '/rest/customer/report/item-solution-page-reports/extend'
const CUSTOMER_ITEM = '/rest/customer/platform/items/all'

export default {
  // 项目欠费统计
  itemArrearage (cb) {
    http.get(ITEM_ARREARAGE_URL).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  // 昨日效果统计
  yesterdayEffect (cb) {
    http.get(YESTERDAY_EFFECT_URL).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  // 总消费统计
  customerItem ({search}, cb) {
    http.get(CUSTOMER_ITEM, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response))
  },
  // 余额
  theBalanceTo ({search}, cb) {
    http.get(BALANCE_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  // 推广数据
  promoteData ({search}, cb) {
    http.get(PROMOTE_DATA_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
