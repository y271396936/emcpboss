import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {FormArgument, SearchArgument} from '@/models/platform/customer-item'
const URL = '/rest/boss/platform/items'

const OPERATE_URL = '/rest/boss/platform/items/{id}'
// 行业
const INDUSTRY_URL = '/rest/boss/platform/items/{id}/industry-values'

// 修改默认预算
const MODIFY_BUDGET = '/rest/boss/platform/items/{id}/budget-update'

// 历史预算记录
const HISTORY_BUDGET = '/rest/boss/platform/items/{id}/budget-change-logs'

// 获取销售人员和客服人员
const SALER_SERVER_URL = '/rest/boss/system/system-users/salesman-server'

// 修改状态
const STATUS_URL = '/rest/boss/platform/items/{id}/status'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
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
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  modifyBudgetWay ({id, budget, reason}, cb) {
    http.put(MODIFY_BUDGET.replace('{id}', id), {
      budget: budget,
      reason: reason
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  budgetList ({id}, cb) {
    http.get(HISTORY_BUDGET.replace('{id}', id), {}).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({form}, cb) {
    let postData = convert.toStringify(form, FormArgument)
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  modifyIndustry ({id, industryId}, cb) {
    http.put(INDUSTRY_URL.replace('{id}', id), {
      industryId: industryId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  serverList (cb) {
    http.get(SALER_SERVER_URL, {}).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  modifyStatus ({id, status, reason}, cb) {
    http.put(STATUS_URL.replace('{id}', id), {
      status: status,
      reason: reason
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
