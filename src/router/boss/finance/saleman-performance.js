const SalemanPerformance = () => import(/* webpackChunkName: "finances" */ '@/components/finance/SalemanPerformance')
const SalePerformanceLine = () => import(/* webpackChunkName: "finances" */ '@/components/finance/SalePerformanceLine')

const routers = [
  {path: 'saleman-performance', component: SalemanPerformance},
  {path: 'sale-performance-line', component: SalePerformanceLine}
]

const menu = {
  title: '销售业绩日报',
  icon: 'leaf',
  path: '/finance/saleman-performance',
  perm: 'analysisSalesPerformance:daily',
  flag: false
}

export default {
  routers,
  menu
}
