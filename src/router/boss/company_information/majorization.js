const Inside = () => import(/* webpackChunkName: "company-group" */ '@/components/company-information/majorization/Inside')
const Advertision = () => import(/* webpackChunkName: "company-group" */ '@/components/company-information/majorization/Advertision')

const routers = [
  {path: 'majorization/inside-information', component: Inside},
  {path: 'majorization/advertision-information', component: Advertision}
]

const menu = {
  title: '优化部',
  icon: 'building',
  flag: false,
  sons: [
    {
      title: '内部资料',
      icon: 'bookmark',
      path: '/company-information/majorization/inside-information',
      perm: 'companyInformation:majorization',
      flag: false
    },
    {
      title: '宣传资料',
      icon: 'bookmark',
      path: '/company-information/majorization/advertision-information',
      perm: 'companyInformation:majorization',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
