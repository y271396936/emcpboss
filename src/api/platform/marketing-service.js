import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {FormArgument, SearchArgument} from '@/models/platform/marketing-service'

const URL = '/rest/boss/platform/marketing-service'
const SERVICE_URL = '/rest/boss/platform/marketing-service/service'
const OPERATOR_URL = '/rest/boss/platform/marketing-service/{id}'
const CATEGORY = '/rest/boss/platform/category/all'
const UPLOAD_URL = '/rest/support/editor/kind/files?dir=image'

export default {
  getCategory (cb) {
    http.get(CATEGORY).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  list ({search}, cb) {
    http.get(SERVICE_URL, {
      params: convert.toJson(search, SearchArgument)
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
// 修改
  modify ({id, form}, cb) {
    let data = convert.toJson(form, FormArgument)
    http.put(OPERATOR_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(OPERATOR_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  thumbnailUpload ({form}, cb) {
    let formData = new FormData()
    formData.append('category', form.category)
    formData.append('imgFile', form.imgFile)
    http.post(UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
