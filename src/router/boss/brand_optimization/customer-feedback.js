const CustomerFeedback = () => import(/* webpackChunkName: "brand-group" */ '@/components/brand_optimization/CustomerFeedback')

const routers = [
  {path: 'customer-feedback', component: CustomerFeedback}
]

const menu = {
  title: '客户后台留言',
  icon: 'windows',
  path: '/brand-optimization/customer-feedback',
  perm: 'reservationService:list',
  flag: false
}

export default {
  routers,
  menu
}
