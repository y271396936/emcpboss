import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/education-report'

const URL = '/rest/boss/report/education-reports'
const EDUCATIONINFOFLOWDAYREPORT_URL = '/rest/boss/report/education-reports/education-infoflow-dayreport'
const IMPORT_URL = '/rest/boss/report/education-reports/files'
const MONTH_URL = ' /rest/boss/report/education-reports/month-reports'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  educationInfoFlowDayReport ({date, orderBy, channelId, itemTitle, industry, page, pageSize}, cb) {
    http.get(EDUCATIONINFOFLOWDAYREPORT_URL, {
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
  monthList ({search}, cb) {
    http.get(MONTH_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
