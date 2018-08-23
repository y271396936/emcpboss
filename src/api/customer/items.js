/**
 *Created by Heqi on 2018/1/18.
 */

import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/customer/items'
import { FormArgument } from '@/models/customer/item-survey'

const URL = '/rest/customer/platform/items'
const QUESTION_URL = '/rest/customer/platform/items/{id}/surveys'
const ITEMS_URL = '/rest/customer/platform/items/all'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getItems (cb) {
    http.get(ITEMS_URL).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({form}, cb) {
    const data = convert.toStringify(form, FormArgument)
    http.post(QUESTION_URL.replace('{id}', form.itemId), data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
