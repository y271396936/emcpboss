import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {SearchArgument} from '@/models/report/intention-word'

const URL = '/rest/boss/report/intention-word-reports'
const INTENTIONANALY_URL = '/rest/boss/report/intention-word-reports/item-infoflow'
const INTENTIONINFOFLOWDAYREPORT_URL = '/rest/boss/report/intention-word-reports/intention-infoflow-dayreport'
const IMPORT_URL = '/rest/boss/report/intention-word-reports/files'
const MONTH_REPORT_URL = '/rest/boss/report/intention-word-reports/month-reports'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  IntentionAnalysisList ({search}, cb) {
    http.get(INTENTIONANALY_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  intentionInfoFlowDayReport ({date, orderBy, channelId, itemTitle, industry, page, pageSize}, cb) {
    http.get(INTENTIONINFOFLOWDAYREPORT_URL, {
      params: {
        startTime: date[0],
        endTime: date[1],
        itemTitle: itemTitle,
        industry: industry,
        channelId: channelId,
        orderBy: orderBy,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  import ({form}, cb) {
    let formData = new FormData()
    formData.append('platformId', form.platformId)
    formData.append('typeId', form.typeId)
    formData.append('reportGenre', form.reportGenre)
    formData.append('fileMode', form.fileMode)
    formData.append('file', form.file)
    formData.append('token', form.token)
    if (form.accountId !== undefined) {
      formData.append('accountId', form.accountId)
    }
    if (form.dataTime !== undefined) {
      formData.append('dataTime', form.dataTime)
    }
    if (form.fileOptional !== undefined) {
      formData.append('fileOptional', form.fileOptional)
    }
    if (form.mergeDuplicate !== undefined) {
      formData.append('mergeDuplicate', form.mergeDuplicate)
    }
    if (form.ignoreNotCost !== undefined) {
      formData.append('ignoreNotCost', form.ignoreNotCost)
    }
    http.post(IMPORT_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getMonthReport ({search}, cb) {
    http.get(MONTH_REPORT_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
