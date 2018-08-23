import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/item-solution-report'

const URL = '/rest/boss/report/item-solution-reports'
const IMPORT_URL = '/rest/boss/report/item-solution-reports/files'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  import ({form}, cb) {
    let formData = new FormData()
    formData.append('typeId', form.typeId)
    formData.append('file', form.file)
    formData.append('token', form.token)
    if (form.accountId !== undefined) {
      formData.append('accountId', form.accountId)
    }
    if (form.typeId === 2 || form.typeId === 13) {
      if (form.day !== undefined) {
        formData.append('day', form.day)
      }
    }
    http.post(IMPORT_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
