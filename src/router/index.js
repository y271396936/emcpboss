import Vue from 'vue'
import Router from 'vue-router'
// 主路由
import Home from '@/components/Home'
import NotFound from '@/components/NotFound'
// import Example from './example/index'  // 样例
Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: Home},
    {path: '/not-found', component: NotFound}
  ]
})
