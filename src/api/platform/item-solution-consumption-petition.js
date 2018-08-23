import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {BudgetFormArgument, FormArgument, SearchArgument} from '@/models/platform/item-solution-consumption-petition'

const URL = '/rest/boss/platform/item-solution-consumption-petitions'
const OPERATE_URL = '/rest/boss/platform/item-solution-consumption-petitions/{id}'
const APPROVAL_URL = '/rest/boss/platform/item-solution-consumption-petitions/{id}/approvals'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  get ({id}, cb) {
    http.get(OPERATE_URL.replace('{id}', id)).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  riseBudget ({form}, cb) {
    let postData = convert.toStringify(form, BudgetFormArgument)
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  approve ({form}, cb) {
    let postData = convert.toStringify(form, FormArgument)
    http.post(APPROVAL_URL.replace('{id}', form.id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
