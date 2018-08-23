import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/customer/nature-pie'

// const URL = '/rest/customer/item/nature-pie'
const ITEM_URL = '/rest/customer/platform/items/all'
const URL = '/rest/customer/report/open-screen-analysis/wordKey'

export default {
  itemTitle (cb) {
    http.get(ITEM_URL).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
