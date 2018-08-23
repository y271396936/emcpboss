const SpreadClient = () => import(/* webpackChunkName: "client-managertions" */ '@/components/operating_center/client_manager/SpreadClient')
const ClientAccount = () => import(/* webpackChunkName: "client-managertions" */ '@/components/operating_center/client_manager/ClientAccount')
const ClientItem = () => import(/* webpackChunkName: "client-managertions" */ '@/components/operating_center/client_manager/ClientItem')
const ClientSurvey = () => import(/* webpackChunkName: "client-managertions" */ '@/components/operating_center/client_manager/ClientSurvey')
const ClientItemsDraf = () => import(/* webpackChunkName: "client-managertions" */ '@/components/operating_center/client_manager/ClientItemsDraf')
// import ActivityReleased from '@/components/operating_center/client_manager/ActivityReleased'

const routers = [
  {path: 'spread-clients', component: SpreadClient},
  {path: 'client-accounts', component: ClientAccount},
  {path: 'client-items', component: ClientItem},
  {path: 'client-survey', component: ClientSurvey},
  {path: 'client-items-draf', component: ClientItemsDraf}
  // {path: 'activity-released', component: ActivityReleased}
]

const menu = {
  title: '客户管理',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '推广客户',
      icon: 'user',
      path: '/customer-center/spread-clients',
      perm: 'projectCustomer:list',
      flag: false
    },
    {
      title: '客户账号',
      icon: 'group',
      path: '/customer-center/client-accounts',
      perm: 'systemCustomerUser:list',
      flag: false
    },
    {
      title: '客户项目',
      icon: 'bookmark',
      path: '/customer-center/client-items',
      perm: 'projectItem:list',
      flag: false
    },
    {
      title: '项目状态更新申请',
      icon: 'street-view',
      path: '/customer-center/client-items-draf',
      perm: 'projectItemDraft:list',
      flag: false
    },
    {
      title: '客户问卷调查',
      icon: 'file-text',
      path: '/customer-center/client-survey',
      perm: 'survey:list',
      flag: false
    }
    // {
    //   title: '资讯管理',
    //   icon: 'pencil-square',
    //   path: '/customer-center/activity-released',
    //   perm: 'CustomerHomeArticle:list',
    //   flag: false
    // }
  ]
}

export default {
  routers,
  menu
}
