import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument, FormArgument } from '@/models/platform/idea'

const URL = '/rest/boss/platform/ideas'
const OPERATE_URL = '/rest/boss/platform/ideas/{id}'
const LIST_URL = '/rest/boss/platform/ideas/{id}/item-solutions'
const DELETE_IDEA_URL = '/rest/boss/platform/ideas/{id}/deleteIdea'

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
  // 删除
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // 项目方案列表
  itemSolutionList ({id, search}, cb) {
    http.get(LIST_URL.replace('{id}', id), {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // 项目方案列表
  addItemSolution ({id, form}, cb) {
    let postData = convert.toStringify(form, FormArgument)
    http.post(LIST_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // 删除
  deleteItemSolution ({id}, cb) {
    http.delete(DELETE_IDEA_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
