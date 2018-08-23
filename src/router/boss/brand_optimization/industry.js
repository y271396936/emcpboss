const IndustryInformation = () => import(/* webpackChunkName: "brand-group" */ '@/components/more_articles/IndustryInformation')

const routers = [
  {path: 'industry', component: IndustryInformation}
]

const menu = {
  title: '行业资讯',
  icon: 'bullhorn',
  path: '/brand-optimization/industry',
  perm: 'marketService:list',
  flag: false
}

export default {
  routers,
  menu
}
