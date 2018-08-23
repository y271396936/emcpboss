const PageDesign = () => import(/* webpackChunkName: "page-channels" */ '@/components/customer-center/PageDesign')

const routers = [
    {path: 'page-design', component: PageDesign}
]

const menu = {
  title: '切图1',
  icon: 'picture-o',
  path: '/customer-center/page-design',
  flag: true
}

export default {
  routers,
  menu
}
