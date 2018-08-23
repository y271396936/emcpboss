import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/platform/bid-keyword-library'

const URL = '/rest/boss/platform/bid-keyword-libraries'
const ALL_URL = '/rest/boss/platform/bid-keyword-libraries/all'
const OPERATE_URL = '/rest/boss/platform/bid-keyword-libraries/{id}'
const LIKENESS_URL = '/rest/boss/platform/bid-keyword-libraries/likenesses'
const IMPORT_URL = '/rest/boss/platform/bid-keyword-libraries/import-keyword'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listAll (cb) {
    http.get(ALL_URL, {
      params: convert.toJson({status: 1}, SearchArgument)
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
  modify ({id, form}, cb) {
    const data = convert.toJson(form, FormArgument)
    http.put(OPERATE_URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response)).catch(trace => cb(trace.response))
  },
  likeness ({search}, cb) {
    http.get(LIKENESS_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  importKeyWord ({form}, cb) {
    let formData = new FormData()
    formData.append('id', form.id)
    formData.append('file', form.file)
    formData.append('token', form.token)
    http.post(IMPORT_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
