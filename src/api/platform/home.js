import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument } from '@/models/platform/customer-home'

const URL = '/rest/customer/system/home-pages/yao-wen'
const HOT_URL = '/rest/customer/system/home-pages/hot-news'
const MARKETING_URL = '/rest/customer/platform/marketing-service/industry'
const MAKESERVICE_URL = '/rest/customer/feedback/reservation-service'
const MIND_URL = '/rest/customer/platform/customer-home-article'
const CONTACT_URL = '/rest/customer/system/home-pages/service'

export default {
  list (cb) {
    http.get(URL).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  newsList (cb) {
    http.get(HOT_URL).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  marketing (cb) {
    http.get(MARKETING_URL).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  mind (cb) {
    http.get(MIND_URL).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  contactNumber (cb) {
    http.get(CONTACT_URL).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  makeService ({form}, cb) {
    let postData = convert.toStringify(form, FormArgument)
    http.post(MAKESERVICE_URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
