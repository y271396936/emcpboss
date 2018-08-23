/**
 *Created by Heqi on 2018/1/12.
 */

import http from '@/utils/http'
import Qs from 'qs'

const URL = '/rest/boss/platform/cdn-accounts'
const ACCOUNT_URL = '/rest/boss/platform/cdn-accounts/all'
const OPERATE_URL = '/rest/boss/platform/cdn-accounts/{id}'

export default {
  list ({idcId, loginAccount, status, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        idcId: idcId,
        loginAccount: loginAccount,
        status: status,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  create ({token, idcId, loginAccount, mobile, accessKey, accessSecret}, cb) {
    let postData = Qs.stringify({
      token: token,
      idcId: idcId,
      loginAccount: loginAccount,
      mobile: mobile,
      accessKey: accessKey,
      accessSecret: accessSecret
    })
    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  modify ({id, idcId, loginAccount, mobile, accessKey, accessSecret, status}, cb) {
    http.put(OPERATE_URL.replace('{id}', id), {
      idcId: idcId,
      loginAccount: loginAccount,
      mobile: mobile,
      accessKey: accessKey,
      accessSecret: accessSecret,
      status: status
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  getAccounts (cb) {
    http.get(ACCOUNT_URL).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  getAccount ({id}, cb) {
    http.get(OPERATE_URL.replace('{id}', id))
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
