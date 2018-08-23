// 主容器
import MainContent from '@/components/customer/menu_navigation/open_screen_analysis/AnalysisContainer'
// 子容器
import Word from './word'
import Province from './province'

const router = {
  path: '/screen',
  name: 'Screen',
  component: MainContent,
  children: [
    ...Word.routers,
    ...Province.routers
  ]
}

export default {
  router
}
