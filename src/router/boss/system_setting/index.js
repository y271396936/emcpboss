// 主容器
import MainContent from '@/components/common/MainContent'
// 子容器
import Organization from './organization'
import Password from './password'
import LoginLog from './login-log'

const router = {
  path: '/system-setting',
  name: 'SystemSetting',
  component: MainContent,
  children: [
    ...Organization.routers,
    ...Password.routers,
    ...LoginLog.routers
  ]
}

const menu = [
  Password.menu,
  LoginLog.menu,
  Organization.menu
]

export default {
  router,
  menu
}
