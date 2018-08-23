const MarketingService = () => import(/* webpackChunkName: "brand-group" */ '@/components/more_articles/MarketingService')
const ClassificationManagement = () => import(/* webpackChunkName: "brand-group" */ '@/components/more_articles/ClassificationManagement')

const routers = [
  {path: 'service', component: MarketingService},
  {path: 'classification', component: ClassificationManagement}
]

const menu = {
  title: '营销服务',
  icon: 'gift',
  flag: false,
  sons: [
    {
      title: '服务',
      icon: 'gift',
      path: '/brand-optimization/service',
      perm: 'marketService:list',
      flag: false
    },
    {
      title: '分类管理',
      icon: 'folder-open',
      path: '/brand-optimization/classification',
      perm: 'Category:list',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
