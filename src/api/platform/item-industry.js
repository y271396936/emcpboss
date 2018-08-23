import http from '@/utils/http'
import Qs from 'qs'

const URL = '/rest/boss/platform/item-industries'
const OPERATE_URL = '/rest/boss/platform/item-industries/{id}'
const ROOT_URL = '/rest/boss/platform/item-industries/roots'
const PARENT_URL = '/rest/boss/platform/item-industries/{id}/parents'
const CHILDREN_URL = '/rest/boss/platform/item-industries/{id}/children'
const CRITERION_URL = '/rest/boss/platform/item-industries/{id}/criteria'
const LIKENESS_URL = '/rest/boss/platform/item-industries/likenesses'
const KEYWORD_URL = '/rest/boss/platform/item-industries/{id}/keyword-strategies'
const ALL_INDUSTRY_URL = '/rest/boss/platform/item-industries/all'

export default {
  list ({pid, title, status, all, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        pid: pid,
        title: title,
        status: status,
        all: all,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({token, pid, title, intro, status}, cb) {
    let postData = Qs.stringify({
      token: token,
      pid: pid,
      title: title,
      intro: intro,
      status: status
    })
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  modify ({id, pid, title, intro, status}, cb) {
    http.put(OPERATE_URL.replace('{id}', id), {
      pid: pid,
      title: title,
      intro: intro,
      status: status
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  root (cb) {
    http.get(ROOT_URL).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  migrate ({id, pid}, cb) {
    http.put(PARENT_URL.replace('{id}', id), {
      pid: pid
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  children ({pid}, cb) {
    http.get(CHILDREN_URL.replace('{id}', pid)).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  criterion ({id}, cb) {
    http.get(CRITERION_URL.replace('{id}', id)).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  modifyCriterion ({id, priceList}, cb) {
    http.put(CRITERION_URL.replace('{id}', id), {
      priceList: priceList
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  likeness ({title}, cb) {
    http.get(LIKENESS_URL, {
      params: {title: title}
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getKeyword ({id, platformId, genre}, cb) {
    http.get(KEYWORD_URL.replace('{id}', id), {
      params: {platformId: platformId, genre: genre}
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getAllIndustry (cb) {
    http.get(ALL_INDUSTRY_URL).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
