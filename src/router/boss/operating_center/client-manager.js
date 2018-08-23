const SpreadClient = () => import(/* webpackChunkName: "client-manager" */ '@/components/operating_center/client_manager/SpreadClient')
const ClientRebateRate = () => import(/* webpackChunkName: "client-manager" */ '@/components/operating_center/client_manager/ClientRebateRate')
const ClientAccount = () => import(/* webpackChunkName: "client-manager" */ '@/components/operating_center/client_manager/ClientAccount')
const ClientItem = () => import(/* webpackChunkName: "client-manager" */ '@/components/operating_center/client_manager/ClientItem')
const ClientSurvey = () => import(/* webpackChunkName: "client-manager" */ '@/components/operating_center/client_manager/ClientSurvey')
const ClientItemsDraf = () => import(/* webpackChunkName: "client-manager" */ '@/components/operating_center/client_manager/ClientItemsDraf')

const routers = [
  {path: 'spread-clients', component: SpreadClient},
  {path: 'client-rebate-rates', component: ClientRebateRate},
  {path: 'client-accounts', component: ClientAccount},
  {path: 'client-items', component: ClientItem},
  {path: 'client-survey', component: ClientSurvey},
  {path: 'client-items-draf', component: ClientItemsDraf}
]

const menu = {
  title: '客户管理',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '推广客户',
      icon: 'user',
      path: '/operating-center/spread-clients',
      perm: 'projectCustomer:list',
      flag: false
    },
    {
      title: '客户返点率',
      icon: 'bullseye',
      path: '/operating-center/client-rebate-rates',
      perm: 'projectRebatesRate:list',
      flag: false
    },
    {
      title: '客户账号',
      icon: 'group',
      path: '/operating-center/client-accounts',
      perm: 'systemCustomerUser:list',
      flag: false
    },
    {
      title: '客户项目',
      icon: 'bookmark',
      path: '/operating-center/client-items',
      perm: 'projectItem:list',
      flag: false
    },
    {
      title: '项目状态更新申请',
      icon: 'street-view',
      path: '/operating-center/client-items-draf',
      perm: 'projectItemDraft:list',
      flag: false
    },
    {
      title: '客户问卷调查',
      icon: 'file-text',
      path: '/operating-center/client-survey',
      perm: 'survey:list',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
