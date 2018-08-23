const Inside = () => import(/* webpackChunkName: "company-group" */ '@/components/company-information/brand/Inside')
const Advertision = () => import(/* webpackChunkName: "company-group" */ '@/components/company-information/brand/Advertision')

const routers = [
  {path: 'brand-center/inside-information', component: Inside},
  {path: 'brand-center/advertision-information', component: Advertision}
]

const menu = {
  title: '品牌中心',
  icon: 'building',
  flag: false,
  sons: [
    {
      title: '内部资料',
      icon: 'bookmark',
      path: '/company-information/brand-center/inside-information',
      perm: 'companyInformation:brand',
      flag: false
    },
    {
      title: '宣传资料',
      icon: 'bookmark',
      path: '/company-information/brand-center/advertision-information',
      perm: 'companyInformation:brand',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
