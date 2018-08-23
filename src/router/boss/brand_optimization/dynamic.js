const CustomerHomeArticle = () => import(/* webpackChunkName: "brand-group" */ '@/components/more_articles/CustomerHomeArticle')

const routers = [
  {path: 'dynamic', component: CustomerHomeArticle}
]

const menu = {
  title: '企业动态',
  icon: 'heart',
  path: '/brand-optimization/dynamic',
  perm: 'CustomerHomeArticle:list',
  flag: false
}

export default {
  routers,
  menu
}
