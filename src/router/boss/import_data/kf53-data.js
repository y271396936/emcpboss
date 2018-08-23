const Kf53Data = () => import(/* webpackChunkName: "import-datas" */ '@/components/operating_center/kf53_data_page/Kf53Data')
const Kf53DataImportLog = () => import(/* webpackChunkName: "import-datas" */ '@/components/operating_center/kf53_data_page/Kf53DataImportLog')
const TelAmount = () => import(/* webpackChunkName: "import-datas" */ '@/components/operating_center/kf53_data_page/TelAmount')
const Kf53DataImport = () => import(/* webpackChunkName: "import-datas" */ '@/components/operating_center/kf53_data_page/Kf53DataImport')

const routers = [
  {path: 'kf53-data', component: Kf53Data},
  {path: 'kf53-data-importLog', component: Kf53DataImportLog},
  {path: 'tel-amount', component: TelAmount},
  {path: 'kf53-data-import', component: Kf53DataImport}
]

const menu = {
  title: '53数据导入',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '53KF数据导入',
      icon: 'upload',
      path: '/import-data/kf53-data-import',
      perm: 'projectService:53Import',
      flag: false
    },
    {
      title: '导入日志',
      icon: 'list',
      path: '/import-data/kf53-data-importLog',
      perm: 'projectKf53ChatRecordImportLog:list',
      flag: false
    },
    {
      title: '53数据列表',
      icon: 'list',
      path: '/import-data/kf53-data',
      perm: 'projectBidKeywordCategory:list',
      flag: false
    },
    {
      title: '要电话量列表',
      icon: 'list',
      path: '/import-data/tel-amount',
      perm: 'projectItemSolutionPageReport:list',
      flag: false
    }
  ]
}
export default {
  routers,
  menu
}
