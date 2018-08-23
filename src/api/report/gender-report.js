/**
 *Created by Heqi on 2018/4/25.
 */

import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/gender-report'

const URL = '/rest/boss/report/gender-reports/list'
const GENDERINFOFLOWDAYREPORT_URL = '/rest/boss/report/gender-reports/gender-infoflow-dayreport'
const GENDER_MONTH_URL = '/rest/boss/report/gender-reports/gender-month-report'
const IMPORT_URL = '/rest/boss/report/gender-reports/import'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  // 月报
  monthList ({search}, cb) {
    http.get(GENDER_MONTH_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  genderInfoFlowDayReport ({date, orderBy, channelId, itemTitle, industry, page, pageSize}, cb) {
    http.get(GENDERINFOFLOWDAYREPORT_URL, {
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
    if (form.planTitle !== undefined) {
      formData.append('planTitle', form.planTitle)
    }
    http.post(IMPORT_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
