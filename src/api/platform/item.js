import http from '@/utils/http'
import Qs from 'qs'
import convert from '@/utils/model-convert'
import { MonthGrowthSearchArgument } from '@/models/platform/item'
import { TrackingLogFormArgument } from '@/models/platform/customer-tracking-log'
import { SurveyFormArgument } from '@/models/platform/item-survey'

const URL = '/rest/boss/platform/items'
const OPERATE_URL = '/rest/boss/platform/items/{id}'
const LIKENESS_URL = '/rest/boss/platform/items/likenesses'
const LIST_VALID_ITEM_URL = '/rest/boss/platform/items/all'
const ORIENTATION_URL = '/rest/boss/platform/items/{id}/orientations'
const SURVEY_URL = '/rest/boss/platform/items/{id}/surveys'
const TRACKING_LOG_URL = '/rest/boss/platform/items/{id}/customer-tracking-logs'
const ARREARAGE_URL = '/rest/boss/platform/items/arrearages'
const MONTH_GROWTH_URL = '/rest/boss/platform/items/month-growths'

export default {
  list ({genre, title, status, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        genre: genre,
        title: title,
        status: status,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({token, customerId, title, salerId, budget, serverId, website, address}, cb) {
    let postData = Qs.stringify({
      token: token,
      customerId: customerId,
      title: title,
      salerId: salerId,
      budget: budget,
      serverId: serverId,
      website: website,
      address: address
    })
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  modify ({id, title, salerId, serverId, website, address}, cb) {
    http.put(OPERATE_URL.replace('{id}', id), {
      title: title,
      salerId: salerId,
      serverId: serverId,
      website: website,
      address: address
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  likeness ({customerId, title, status, page, pageSize}, cb) {
    http.get(LIKENESS_URL, {
      params: {
        customerId: customerId,
        title: title,
        status: status,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  arrearage (cb) {
    http.get(ARREARAGE_URL).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  monthGrowth ({search}, cb) {
    http.get(MONTH_GROWTH_URL, {
      params: convert.toJson(search, MonthGrowthSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listValidItem ({id}, cb) {
    http.get(LIST_VALID_ITEM_URL, {params: {customerId: id}}).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  listOrientation ({id}, cb) {
    http.get(ORIENTATION_URL.replace('{id}', id)).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getSurvey ({id}, cb) {
    http.get(SURVEY_URL.replace('{id}', id)).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  addSurvey ({id, form}, cb) {
    let postData = convert.toStringify(form, SurveyFormArgument)
    http.post(SURVEY_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listTrackingLog ({id, page}, cb) {
    http.get(TRACKING_LOG_URL.replace('{id}', id), {
      params: {page: page}
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  addTrackingLog ({id, form}, cb) {
    let postData = convert.toStringify(form, TrackingLogFormArgument)
    http.post(TRACKING_LOG_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
