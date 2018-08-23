const BasicInformation = () => import(/* webpackChunkName: "company-group" */ '@/components/company-information/sales-department/BasicInformation')

const routers = [
    {path: 'sales-department/basic-information', component: BasicInformation}
]

const menu = {
  title: '销售部',
  icon: 'building',
  flag: false,
  sons: [
    {
      title: '基本资料',
      icon: 'bookmark',
      path: '/company-information/sales-department/basic-information',
      perm: 'companyInformation:sale',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
