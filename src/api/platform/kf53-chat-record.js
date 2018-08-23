import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/platform/kf53-chat-record'

const URL = '/rest/boss/report/53kf-chat-records'
const IMPORT_URL = '/rest/boss/report/53kf-chat-records/files'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  import ({form}, cb) {
    let formData = new FormData()
    formData.append('file', form.file)
    formData.append('token', form.token)
    http.post(IMPORT_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
