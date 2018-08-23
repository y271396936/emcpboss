import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/report/item-solution-daily-budget'

const URL = '/rest/boss/report/item-solution-daily-budgets'
const PETITION_URL = '/rest/boss/report/item-solution-daily-budgets/{id}/petitions'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  petition ({id, form}, cb) {
    const data = convert.toJson(form, FormArgument)
    http.put(PETITION_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
