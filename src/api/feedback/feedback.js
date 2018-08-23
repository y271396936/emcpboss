import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FeedbackSearchArgument } from '../../models/feedback/feedback'

const URL = '/rest/boss/feedback/feedbacks'
const OPERATE_URL = '/rest/boss/feedback/feedbacks/{id}'
const DELETE_URL = '/rest/boss/feedback/feedbacks/{id}/deletions'
const RECOVER_URL = '/rest/boss/feedback/feedbacks/{id}/recoveries'
const OPEN_QUESTIONNAIRE_URL = '/rest/boss/feedback/feedbacks/{id}/open-questionnaires'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, FeedbackSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.put(DELETE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  recover ({id}, cb) {
    http.put(RECOVER_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  destroy ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getOpenQuestionnaire ({id}, cb) {
    http.get(OPEN_QUESTIONNAIRE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
