const BasicInformation = () => import(/* webpackChunkName: "company-group" */ '@/components/company-information/media/BasicInformation')

const routers = [
  {path: 'media-department/basic-information', component: BasicInformation}
]

const menu = {
  title: '媒介部',
  icon: 'building',
  flag: false,
  sons: [
    {
      title: '基本资料',
      icon: 'bookmark',
      path: '/company-information/media-department/basic-information',
      perm: 'companyInformation:media',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
