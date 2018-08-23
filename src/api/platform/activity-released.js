import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {
  FormArgument, SearchArgument
} from '@/models/platform/activity-released'

const URL = '/rest/boss/platform/customer-home-article'
const DELETE_URL = '/rest/boss/platform/customer-home-article/{id}'
const MODIFY_THE_URL = '/rest/boss/platform/customer-home-article/{id}'
const DEFAULT_HOME_URL = '/rest/boss/platform/customer-home-article/defalut-display/{id}'
const RECOMMENDED_HOME_URL = '/rest/boss/platform/customer-home-article/display/{id}'
const THE_HOME = '/rest/customer/platform/customer-home-article'
const QUERY = '/rest/boss/platform/category'

export default {
  insert ({form}, cb) {
    let postData = convert.toStringify(form, FormArgument)
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(DELETE_URL.replace('{id}', id))
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  // 默认主页
  defaulted ({id}, cb) {
    http.put(DEFAULT_HOME_URL.replace('{id}', id))
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  // 推荐主页
  recommended ({id}, cb) {
    http.put(RECOMMENDED_HOME_URL.replace('{id}', id))
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  // 修改
  modify ({id}, {form}, cb) {
    let data = convert.toJson(form, FormArgument)
    http.put(MODIFY_THE_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // 查询分类
  querys (cb) {
    http.get(QUERY).then(response => cb(response))
  },
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  theHome (cb) {
    http.get(THE_HOME).then(response => cb(response))
  }
}
