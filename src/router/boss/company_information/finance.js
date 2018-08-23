const BasicInformation = () => import(/* webpackChunkName: "company-group" */ '@/components/company-information/finance/BasicInformation')

const routers = [
  {path: 'finance-department/basic-information', component: BasicInformation}
]

const menu = {
  title: '财务部',
  icon: 'building',
  flag: false,
  sons: [
    {
      title: '基本资料',
      icon: 'bookmark',
      path: '/company-information/finance-department/basic-information',
      perm: 'companyInformation:finance',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
