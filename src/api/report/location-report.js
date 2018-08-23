import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/location-report'

const URL = '/rest/boss/report/location-reports'
const IMPORT_URL = '/rest/boss/report/location-reports/files'
const ANALYSIS_URL = '/rest/boss/report/location-reports/analysis'
const DAILY_URL = '/rest/boss/report/location-reports/daily-reports'
const MONTH_URL = '/rest/boss/report/location-reports/month-reports'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
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
  analyse ({search}, cb) {
    http.get(ANALYSIS_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listDailyReport ({search}, cb) {
    http.get(DAILY_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listMonthReport ({search}, cb) {
    http.get(MONTH_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
