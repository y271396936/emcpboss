// 主容器
import MainContent from '@/components/common/MainContent'
// 子容器
import CustomerFeedback from './customer-feedback'
import Seo from './seo'
import SeoCase from './seo-case'
import Dynamic from './dynamic'
import Industry from './industry'
import Service from './service'

const router = {
  path: '/brand-optimization',
  name: 'BrandOptimization',
  component: MainContent,
  children: [
    ...CustomerFeedback.routers,
    ...Seo.routers,
    ...SeoCase.routers,
    ...Dynamic.routers,
    ...Industry.routers,
    ...Service.routers
  ]
}

const menu = [
  CustomerFeedback.menu,
  Seo.menu,
  SeoCase.menu,
  Dynamic.menu,
  Industry.menu,
  Service.menu
]

export default {
  router,
  menu
}
