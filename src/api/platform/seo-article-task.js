/**
 * Created by yh on 2018/1/3.
 */

import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument, FormArgument } from '@/models/platform/seo-article-task'

const URL = '/rest/boss/platform/seo-article-tasks'

// 日志列表
const OPERATE_URL = '/rest/boss/platform/seo-article-tasks/{id}'

// 执行任务
const HANDLE_URL = '/rest/boss/platform/seo-article-tasks/{id}/handling'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({form}, cb) {
    const data = convert.toStringify(form, FormArgument)
    http.post(URL, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // 日志列表
  listLog ({id}, cb) {
    http.get(OPERATE_URL.replace('{id}', id)).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // 执行
  modifyHandle ({id}, cb) {
    http.get(HANDLE_URL.replace('{id}', id)).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
