const ItemSolution = () => import(/* webpackChunkName: "opera-center-bid" */ '@/components/operating_center/bid/ItemSolution')
const ItemOperationProcess = () => import(/* webpackChunkName: "opera-center-bid" */ '@/components/operating_center/bid/ItemOperationProcess')
const ItemSolutionBudgetPetition = () => import(/* webpackChunkName: "opera-center-bid" */ '@/components/operating_center/bid/ItemSolutionBudgetPetition')
const ItemSolutionConsumptionPetition = () => import(/* webpackChunkName: "opera-center-bid" */ '@/components/operating_center/bid/ItemSolutionConsumptionPetition')
const ItemSolutionStatusPetition = () => import(/* webpackChunkName: "opera-center-bid" */ '@/components/operating_center/bid/ItemSolutionStatusPetition')
const ItemSolutionTimeNode = () => import(/* webpackChunkName: "opera-center-bid" */ '@/components/operating_center/bid/ItemSolutionTimeNode')
const Kf53Account = () => import(/* webpackChunkName: "opera-center-bid" */ '@/components/operating_center/bid/53kfAccount')
const PageDesign = () => import(/* webpackChunkName: "opera-center-bid" */ '@/components/customer-center/PageDesign')

const routers = [
  {path: 'item-solutions', component: ItemSolution},
  {path: 'item-operation-process', component: ItemOperationProcess},
  {path: 'item-solution-budget-petitions', component: ItemSolutionBudgetPetition},
  {path: 'item-solution-consumption-petitions', component: ItemSolutionConsumptionPetition},
  {path: 'item-solution-status-petitions', component: ItemSolutionStatusPetition},
  {path: 'item-solution-time-nodes', component: ItemSolutionTimeNode},
  {path: '53kf-accounts', component: Kf53Account},
  {
    path: 'item-solutions/:id/page-design',
    name: 'itemSolutionPageDesign',
    component: PageDesign,
    props: true
  }
]

const menu = {
  title: '竞价管理',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '项目方案',
      icon: 'glass',
      path: '/operating-center/item-solutions',
      perm: 'projectItemSolution:list',
      flag: false
    },
    {
      title: '项目方案运营过程',
      icon: 'trello',
      path: '/operating-center/item-operation-process',
      perm: 'projectItemSolutionAdjustJob:list',
      flag: false
    },
    {
      title: '项目方案预算修改申请',
      icon: 'rmb',
      path: '/operating-center/item-solution-budget-petitions',
      perm: 'projectItemSolutionBudgetPetition:list',
      flag: false
    },
    {
      title: '项目方案涨预算申请',
      icon: 'level-up',
      path: '/operating-center/item-solution-consumption-petitions',
      perm: 'projectItemSolutionConsumptionPetition:list',
      flag: false
    },
    {
      title: '项目方案上下稿申请',
      icon: 'hand-o-down',
      path: '/operating-center/item-solution-status-petitions',
      perm: 'projectItemSolutionStatusPetition:list',
      flag: false
    },
    {
      title: '节点数据管理',
      icon: 'clock-o',
      path: '/operating-center/item-solution-time-nodes',
      perm: 'projectItemSolutionTimeNode:list',
      flag: false
    },
    {
      title: '53快服管理',
      icon: 'headphones',
      path: '/operating-center/53kf-accounts',
      perm: 'projectKf53Account:list',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
