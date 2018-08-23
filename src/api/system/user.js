import http from '@/utils/http'
import Qs from 'qs'

const _AUTHORIZATION_URL = '/rest/support/authorization'
const SSO_LOGIN_URL = '/rest/boss/system/authorization/{id}'

export default {
  getInfo (cb) {
    http.get(_AUTHORIZATION_URL)
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  login ({loginAccount, password}, cb) {
    // http login
    let postData = Qs.stringify({
      loginAccount: loginAccount,
      password: password
    })

    http.post(_AUTHORIZATION_URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  logout (cb) {
    http.delete(_AUTHORIZATION_URL)
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  ssoLogin ({id}, cb) {
    http.get(SSO_LOGIN_URL.replace('{id}', id))
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
