import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument, FormArgument } from '@/models/platform/seo-article-site'

const URL = '/rest/boss/platform/seo-article-sites'
const SITE_ALL_URL = '/rest/boss/platform/seo-article-sites/all'
const OPERATE_URL = '/rest/boss/platform/seo-article-sites/{id}'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listAll (cb) {
    http.get(SITE_ALL_URL).then(response => cb(response)).catch(trace => cb(trace.response))
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
  }
}
