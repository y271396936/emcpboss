import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {
  FormArgument, MonthGrowthSearchArgument,
  SearchArgument
} from '@/models/platform/customer'

const URL = '/rest/boss/platform/customers'
const OPERATE_URL = '/rest/boss/platform/customers/{id}'
const LIKENESS_URL = '/rest/boss/platform/customers/likenesses'
const LIST_VALID_CUSTOMER_URL = '/rest/boss/platform/customers/all'
// const APPOINT_URL = '/rest/boss/platform/customers/{id}/appointing'
const SALER_URL = '/rest/boss/platform/customers/saler'
const MONTH_GROWTH_URL = '/rest/boss/platform/customers/month-growths'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({form}, cb) {
    let postData = convert.toStringify(form, FormArgument)
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  modify ({id, form}, cb) {
    const data = convert.toJson(form, FormArgument)
    http.put(OPERATE_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  likeness ({search}, cb) {
    http.get(LIKENESS_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  monthGrowth ({search}, cb) {
    http.get(MONTH_GROWTH_URL, {
      params: convert.toJson(search, MonthGrowthSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listValidCustomer (cb) {
    http.get(LIST_VALID_CUSTOMER_URL).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  salerList (cb) {
    http.get(SALER_URL, {
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
