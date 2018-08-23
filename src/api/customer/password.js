/**
 *Created by Heqi on 2018/1/17.
 */

import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument } from '@/models/customer/password'

const URL = '/rest/customer/system/users/password'

export default {
  modify ({form}, cb) {
    const data = convert.toJson(form, FormArgument)
    http.put(URL, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
