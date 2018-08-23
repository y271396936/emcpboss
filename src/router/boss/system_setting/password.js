const Password = () => import(/* webpackChunkName: "boss-routers" */ '@/components/system_setting/Password')

const routers = [
  {path: 'passwords', component: Password}
]

const menu = {
  title: '修改密码',
  icon: 'key',
  path: '/system-setting/passwords',
  flag: true
}

export default {
  routers,
  menu
}
