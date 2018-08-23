const BasicInformation = () => import(/* webpackChunkName: "company-group" */ '@/components/company-information/HR-department/BasicInformation')

const routers = [
  {path: 'HR-department/basic-information', component: BasicInformation}
]

const menu = {
  title: '人事部',
  icon: 'building',
  flag: false,
  sons: [
    {
      title: '基本资料',
      icon: 'bookmark',
      path: '/company-information/HR-department/basic-information',
      perm: 'companyInformation:HR',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
