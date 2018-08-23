const BasicInformation = () => import(/* webpackChunkName: "company-group" */ '@/components/company-information/service/BasicInformation')

const routers = [
  {path: 'service-department/basic-information', component: BasicInformation}
]

const menu = {
  title: '客服部',
  icon: 'building',
  flag: false,
  sons: [
    {
      title: '基本资料',
      icon: 'bookmark',
      path: '/company-information/service-department/basic-information',
      perm: 'companyInformation:service',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
