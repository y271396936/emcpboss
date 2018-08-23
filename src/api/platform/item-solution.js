import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {
  DownloadFormArgument, FormArgument, NodeDataFormArgument,
  ReportFormArgument, SearchArgument
} from '@/models/platform/item-solution'
import { FormArgument as PageDesignFormArgument } from '@/models/platform/page-design'

const URL = '/rest/boss/platform/item-solutions'
const OPERATE_URL = '/rest/boss/platform/item-solutions/{id}'
const KF53_OPENED_URL = '/rest/boss/platform/item-solutions/{id}/53-openings'
const KF53_REPORT_URL = '/rest/boss/platform/item-solutions/{id}/53-reports'
const BUDGET_URL = '/rest/boss/platform/item-solutions/{id}/budgets'
const CRITERIA_URL = '/rest/boss/platform/item-solutions/{id}/criteria'
const STATUS_URL = '/rest/boss/platform/item-solutions/{id}/status'
const APPORTION_URL = '/rest/boss/platform/item-solutions/{id}/owns'
const ACCOUNT_URL = '/rest/boss/platform/item-solutions/{id}/accounts'
const READ_ORIENTATION_URL = '/rest/boss/platform/item-solutions/{id}/orientations'
const READ_OPERATING_PROCESS_URL = '/rest/boss/platform/item-solutions/{id}/operating-process-read'
const READ_BID_REVIEW_URL = '/rest/boss/platform/item-solutions/{id}/bid-review-read'
const READ_SURVEY_URL = '/rest/boss/platform/item-solutions/{id}/survey-read'
const ADJUST_JOB_URL = '/rest/boss/platform/item-solutions/{id}/adjust-jobs'
const SPLIT_FILE_URL = '/rest/boss/platform/item-solutions/{id}/split-keyword/files'
const PAGE_VERIFY_URL = '/rest/boss/platform/item-solutions/{id}/page-review'
const NODE_DATA = '/rest/boss/report/item-solution-time-node-reports'
const ACCOUNT_PASSWORD_URL = '/rest/boss/platform/item-solutions/{id}/account-password'
const CLIENT_URL = '/rest/boss/platform/item-solutions/{id}/clients'
const LIKENAME_URL = '/rest/boss/system/system-users/name'
const PAGE_DESIGN_URL = '/rest/boss/platform/item-solutions/{id}/page-designs'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // getTodayAdjustJob ({id}, cb) {
  //   http.get(TODAY_ADJUST_JOB_URL.replace('{id}', id))
  //     .then(response => cb(response)).catch(trace => cb(trace.response))
  // },
  pageUrlVerify ({id, form}, cb) {
    let postData = convert.toStringify(form, FormArgument)
    http.post(PAGE_VERIFY_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listAdjustJob ({id, page, pageSize}, cb) {
    http.get(ADJUST_JOB_URL.replace('{id}', id), {
      params: {
        page: page,
        pageSize: pageSize
      }
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
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  switchKf53Opened ({id}, cb) {
    http.put(KF53_OPENED_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  modifyBudget ({id, budget}, cb) {
    http.put(BUDGET_URL.replace('{id}', id), {
      budget: budget
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  modifyCriteria ({id, talkPrice, feedbackPrice}, cb) {
    http.put(CRITERIA_URL.replace('{id}', id), {
      talkPrice: talkPrice,
      feedbackPrice: feedbackPrice
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  switchStatus ({id}, cb) {
    http.put(STATUS_URL.replace('{id}', id), {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  apportion ({id, regulatorId}, cb) {
    http.put(APPORTION_URL.replace('{id}', id), {
      regulatorId: regulatorId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  changeAccount ({id, accountId}, cb) {
    http.put(ACCOUNT_URL.replace('{id}', id), {
      accountId: accountId
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  readOrientation ({id}, cb) {
    http.put(READ_ORIENTATION_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  readOperating ({id}, cb) {
    http.put(READ_OPERATING_PROCESS_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  readBidReview ({id}, cb) {
    http.put(READ_BID_REVIEW_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  readSurveyRead ({id}, cb) {
    http.put(READ_SURVEY_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  download ({id, form}, cb) {
    let postData = convert.toStringify(form, DownloadFormArgument)
    http.post(SPLIT_FILE_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  addReport ({id, form}, cb) {
    let postData = convert.toStringify(form, ReportFormArgument)
    http.post(KF53_REPORT_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  addNodeData ({form}, cb) {
    let postData = convert.toStringify(form, NodeDataFormArgument)
    http.post(NODE_DATA, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  accountPassword ({id}, cb) {
    http.get(ACCOUNT_PASSWORD_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  changeDevice ({id, form}, cb) {
    const data = convert.toJson(form, FormArgument)
    http.put(CLIENT_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  likeName ({name, status, page, pageSize}, cb) {
    http.get(LIKENAME_URL, {
      params: {
        name: name,
        status: status,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  deployPageDesign ({id, form}, cb) {
    const data = convert.toJson(form, PageDesignFormArgument)
    http.post(PAGE_DESIGN_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
