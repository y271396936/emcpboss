import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { TrackingLogFormArgument } from '@/models/platform/customer-tracking-log'

const URL = '/rest/boss/platform/customer-tracking-logs/{id}'

export default {
  modify ({id, form}, cb) {
    const data = convert.toJson(form, TrackingLogFormArgument)
    http.put(URL.replace('{id}', id), data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
