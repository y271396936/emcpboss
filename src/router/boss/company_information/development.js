const BasicInformation = () => import(/* webpackChunkName: "company-group" */ '@/components/company-information/development/BasicInformation')

const routers = [
  {path: 'development/basic-information', component: BasicInformation}
]

const menu = {
  title: '研发部',
  icon: 'building',
  flag: false,
  sons: [
    {
      title: '基本资料',
      icon: 'bookmark',
      path: '/company-information/development/basic-information',
      perm: 'companyInformation:development',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
