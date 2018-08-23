import http from 'axios'
import store from './../store'
import { userAction } from './../store/action-names'

// 默认超时时间
http.defaults.timeout = 300000
// 启用全局 cookie
http.defaults.withCredentials = true

// 通用头部信息设置

// // http请求拦截器
// http.interceptors.request.use(config => {
//   return config
// }, error => {
//   return Promise.reject(error)
// })

// 响应拦截器
http.interceptors.response.use(response => {
  // console.log('http.interceptors: ', response)
  return response
}, error => {
  // console.log('http.interceptors: ', error, error.response)
  const response = error.response || {}
  if (response.status === 401) {
    // 未认证
    store.dispatch(userAction.logout)
  }
  return Promise.reject(error)
})

export default http
