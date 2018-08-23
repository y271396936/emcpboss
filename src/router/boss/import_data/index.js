// 主容器
import MainContent from '@/components/common/MainContent'
// 子容器
import Kf53Data from './kf53-data'
import Consumption from '../import_data/consumption'
import Perspective from '../import_data/perspective'

const router = {
  path: '/import-data',
  name: 'ImportData',
  component: MainContent,
  children: [
    ...Kf53Data.routers,
    ...Consumption.routers,
    ...Perspective.routers
  ]
}

const menu = [
  Kf53Data.menu,
  Consumption.menu,
  Perspective.menu
]

export default {
  router,
  menu
}
