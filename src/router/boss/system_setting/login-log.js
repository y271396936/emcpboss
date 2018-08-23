const SystemUserLoginLog = () => import(/* webpackChunkName: "boss-routers" */ '@/components/system_setting/SystemUserLoginLog')

const routers = [
  {path: 'login-logs', component: SystemUserLoginLog}
]

const menu = {
  title: '登录历史记录',
  icon: 'book',
  path: '/system-setting/login-logs',
  flag: true
}

export default {
  routers,
  menu
}
