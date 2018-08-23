// 主容器
import MainContent from '@/components/common/MainContent'
// 子容器
import ItemIndustry from './industry'
import Bid from './bid'
import KeywordManager from './keyword-manager'
import OperatingAnalysis from './operating-analysis'
import Idea from './idea'

const router = {
  path: '/operating-center',
  name: 'OperatingCenter',
  component: MainContent,
  children: [
    ...ItemIndustry.routers,
    ...Bid.routers,
    ...KeywordManager.routers,
    ...OperatingAnalysis.routers,
    ...Idea.routers
  ]
}

const menu = [
  ItemIndustry.menu,
  Bid.menu,
  KeywordManager.menu,
  OperatingAnalysis.menu,
  Idea.menu
]

export default {
  router,
  menu
}
