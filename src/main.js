// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueCookie from 'vue-cookie'
import ElementUI from 'element-ui'
import VCharts from 'v-charts'
import Icon from 'vue-awesome/components/Icon'
import VideoPlayer from 'vue-video-player'
import OpenUtils from './plugins/open'
import App from './App'
import FinanceApp from './view/finance/App'
import IncrementApp from './view/increment/App'
import IntermadiaryApp from './view/intermediary/App'
import MajorizationApp from './view/majorization/App'
import ManagementApp from './view/management/App'
import OperationApp from './view/operation/App'
import SaleApp from './view/sale/App'
import ServiceApp from './view/service/App'
import BrandApp from './view/brand/App'
import router from './router'
import store from './store'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/element-reset.scss'
import './assets/styles/default.scss'
import './assets/styles/animation.scss'
import './assets/styles/transition.scss'
import 'vue-awesome/icons'

import UrlUtil from './utils/url-utils'

// todo
// // 自定义指令
// Vue.directive('role', {
//   bind (el, binding, vnode) {
//     // 角色不对，移除 DOM
//     if (binding.value !== 'boss') {
//       el.parentNode.removeChild(el)
//     }
//   }
// })
//
// Vue.directive('perm', {
//   bind (el, binding, vnode) {
//     // 没有权限，移除 DOM
//     if (permUtils.has(binding.value)) {
//       el.parentNode.removeChild(el)
//     }
//   }
// })

Vue.use(VueCookie)
Vue.use(ElementUI)
Vue.use(VCharts)
Vue.use(OpenUtils)
Vue.use(VideoPlayer)

Vue.component('icon', Icon)
// Vue.component(CollapseTransition.name, CollapseTransition)

// Vue.config.debug = true;
Vue.config.silent = true
// Vue.config.productionTip = false

// // 路由守卫
// router.beforeEach((to, from, next) => {
//   if (to.matched.length > 0) {
//     next()
//   } else {
//     next({path: 'not-found'})
//   }
// })

Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。

  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
/* url地址解析 */
let url = window.location.href
let compose = UrlUtil.parse(url)
/* eslint-disable no-new */
if (compose.file === 'index.html' || compose.file === '') {
  new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
  })
}
if (compose.file === 'finance.html') {
  new Vue({
    el: '#financApp',
    store,
    router,
    template: '<FinanceApp/>',
    components: { FinanceApp }
  })
}
if (compose.file === 'increment.html') {
  new Vue({
    el: '#incrementApp',
    store,
    router,
    template: '<IncrementApp/>',
    components: { IncrementApp }
  })
}
if (compose.file === 'intermediary.html') {
  new Vue({
    el: '#intermediaryApp',
    store,
    router,
    template: '<IntermadiaryApp/>',
    components: { IntermadiaryApp }
  })
}
if (compose.file === 'majorization.html') {
  new Vue({
    el: '#majorizationApp',
    store,
    router,
    template: '<MajorizationApp/>',
    components: { MajorizationApp }
  })
}
if (compose.file === 'management.html') {
  new Vue({
    el: '#managementApp',
    store,
    router,
    template: '<ManagementApp/>',
    components: { ManagementApp }
  })
}
if (compose.file === 'operation.html') {
  new Vue({
    el: '#operationApp',
    store,
    router,
    template: '<OperationApp/>',
    components: { OperationApp }
  })
}
if (compose.file === 'sale.html') {
  new Vue({
    el: '#saleApp',
    store,
    router,
    template: '<SaleApp/>',
    components: { SaleApp }
  })
}
if (compose.file === 'service.html') {
  new Vue({
    el: '#serviceApp',
    store,
    router,
    template: '<ServiceApp/>',
    components: { ServiceApp }
  })
}
if (compose.file === 'brand.html') {
  new Vue({
    el: '#brandApp',
    store,
    router,
    template: '<BrandApp/>',
    components: { BrandApp }
  })
}
