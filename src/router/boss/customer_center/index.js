// 主容器
import MainContent from '@/components/common/MainContent'
// 子容器
import Channel from './channel'
import CdnRefresh from './cdn-refresh'
import ClientManager from './client-manager'

const router = {
  path: '/customer-center',
  name: 'CustomerCenter',
  component: MainContent,
  children: [
    ...Channel.routers,
    ...ClientManager.routers,
    ...CdnRefresh.routers
  ]
}

const menu = [
  Channel.menu,
  ClientManager.menu,
  CdnRefresh.menu
]

export default {
  router,
  menu
}
