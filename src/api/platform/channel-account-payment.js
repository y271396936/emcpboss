import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { FormArgument, SearchArgument } from '@/models/platform/channel-account-payment'

const URL = '/rest/boss/platform/channel-account-payments'
const REVOKE_URL = '/rest/boss/platform/channel-account-payments/{id}/revoking'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  revoke ({id, revokeReason}, cb) {
    let postData = convert.toStringify({revokeReason: revokeReason}, FormArgument)
    http.post(REVOKE_URL.replace('{id}', id), postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
