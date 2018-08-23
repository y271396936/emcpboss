// 主容器
import MainContent from '@/components/common/MainContent'
// 子容器
import Day from './day'
import Month from './month'

const router = {
  path: '/consumption',
  name: 'Consumption',
  component: MainContent,
  children: [
    ...Day.routers,
    ...Month.routers
  ]
}

export default {
  router
}
