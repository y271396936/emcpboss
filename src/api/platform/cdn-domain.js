/**
 *Created by Heqi on 2018/1/12.
 */

import http from '@/utils/http'
import Qs from 'qs'

const URL = '/rest/boss/platform/cdn-domains'
const OPERATE_URL = '/rest/boss/platform/cdn-domains/{id}'

export default {
  list ({domain, status, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        domain: domain,
        status: status,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({token, accountId, domain, subDomain}, cb) {
    let postData = Qs.stringify({
      token: token,
      accountId: accountId,
      domain: domain,
      subDomain: subDomain
    })
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  modify ({id, accountId, domain, subDomain, status}, cb) {
    http.put(OPERATE_URL.replace('{id}', id), {
      accountId: accountId,
      domain: domain,
      subDomain: subDomain,
      status: status
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  delete ({id}, cb) {
    http.delete(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
