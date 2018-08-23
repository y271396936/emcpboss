/**
 *Created by Heqi on 2018/1/25.
 */

import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FeedbackSearchArgument } from '../../models/customer/feedbacks'

const URL = '/rest/customer/feedback/feedbacks'
const READ_URL = '/rest/customer/feedback/feedbacks/{id}/read'
const UNREAD_URL = '/rest/customer/feedback/feedbacks/{id}/unread'
const DELETE_URL = '/rest/customer/feedback/feedbacks/{id}'
const ITEM_URL = '/rest/customer/platform/items/all'
const OPEN_QUESTIONNAIRE_URL = '/rest/customer/feedback/feedbacks/{id}/open-questionnaires'
const READ_MUL_URL = '/rest/customer/feedback/feedbacks/read'
const UNREAD_MUL_URL = '/rest/customer/feedback/feedbacks/unread'

export default {
  start (cb) {
    http.get(URL).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  itemTitle (cb) {
    http.get(ITEM_URL).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, FeedbackSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(DELETE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  read ({id}, cb) {
    http.put(READ_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  unread ({id}, cb) {
    http.put(UNREAD_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getOpenQuestionnaire ({id}, cb) {
    http.get(OPEN_QUESTIONNAIRE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  readMul ({ids}, cb) {
    http.put(READ_MUL_URL, {
      ids: ids
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  unReadMul ({ids}, cb) {
    http.put(UNREAD_MUL_URL, {
      ids: ids
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
