const ItemSolutionReportImport = () => import(/* webpackChunkName: "consumptions" */ '@/components/operating_center/consumption/ItemSolutionReportImport')
const ItemSolutionReportImportLog = () => import(/* webpackChunkName: "consumptions" */ '@/components/operating_center/consumption/ItemSolutionReportImportLog')
const ItemSolutionReport = () => import(/* webpackChunkName: "consumptions" */ '@/components/operating_center/consumption/ItemSolutionReport')

const routers = [
  {path: 'item-solution-report/import', component: ItemSolutionReportImport},
  {path: 'item-solution-report/import-logs', component: ItemSolutionReportImportLog},
  {path: 'item-solution-reports', component: ItemSolutionReport}
]

const menu = {
  title: '消费数据导入',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '消费数据导入',
      icon: 'upload',
      path: '/operating-center/item-solution-report/import',
      perm: 'financeItemSolutionReport:import',
      flag: false
    },
    {
      title: '导入日志',
      icon: 'list',
      path: '/operating-center/item-solution-report/import-logs',
      perm: 'financeItemSolutionReport:importLogs',
      flag: false
    },
    {
      title: '消费列表',
      icon: 'list',
      path: '/operating-center/item-solution-reports',
      perm: 'financeItemSolutionReport:list',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
