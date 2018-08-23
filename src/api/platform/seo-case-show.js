import http from '@/utils/http'
import convert from '@/utils/model-convert'
import {FormArgument, SearchArgument} from '@/models/platform/seo-case-show'

const URL = '/rest/boss/platform/seo-case-show'
const OPERATE_URL = '/rest/boss/platform/seo-case-show/{id}'
const APPROVAL_URL = '/rest/boss/platform/seo-case-show/{id}/approval'
const UPLOAD_URL = '/rest/support/editor/kind/files?dir=image'

export default {
  list ({search}, cb) {
    http.get(URL, {
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
    http.put(OPERATE_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
// 审阅
  applyCase ({id}, cb) {
    http.put(APPROVAL_URL.replace('{id}', id), {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
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
