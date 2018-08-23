/**
 * 新窗口打开链接
 */
import UrlUtils from '@/utils/url-utils'

const openWindow = (url, target = '_blank') => {
  if (url === undefined || url === null || url.length === 0) {
    console.error('no set first argument `url`')
    return
  }

  const urls = UrlUtils.parse(url)
  const action = url.replace(urls.query, '')

  // 创建表单
  const form = document.createElement('form')
  form.setAttribute('method', 'get')
  form.setAttribute('target', target)
  form.setAttribute('action', action)

  // 设置表单提交内容
  for (let key in urls.params) {
    if (urls.params.hasOwnProperty(key)) {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', key)
      input.setAttribute('value', urls.params[key])

      form.appendChild(input)
    }
  }

  // 插入 DOM
  const body = document.getElementsByTagName('body')[0]
  body.appendChild(form)

  // 提交并删除表单
  form.submit()
  form.remove()
}

export default {
  install (Vue) {
    Vue.prototype.$open = {
      window: openWindow
    }
  }
}
