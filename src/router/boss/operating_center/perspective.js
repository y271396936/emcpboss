const PerspectiveReportImport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/PerspectiveReportImport')
const PerspectiveReportImportLog = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/PerspectiveReportImportLog')
const KeywordReport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/KeywordReport')
const RegionReport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/RegionReport')
const TimeShareReport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/TimeShareReport')
const SearchKeywordReport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/SearchKeywordReport')
const PlatformReport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/PlatformReport')
const NetworkReport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/NetworkReport')
const EducationReport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/EducationReport')
const LocationReport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/LocationReport')
const AgeRangReport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/AgeRangeReport')
const GenderReport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/GenderReport')
const InterestTypeReport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/InterestTypeReport')
const OperatingSystemReport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/OperatingSystemReport')
const IntentionWordReport = () => import(/* webpackChunkName: "perspectives" */ '@/components/operating_center/perspective/IntentionWordReport')

const routers = [
  {path: 'perspective-report/import', component: PerspectiveReportImport},
  {path: 'perspective-report-import-logs', component: PerspectiveReportImportLog},
  {path: 'keyword-reports', component: KeywordReport},
  {path: 'region-reports', component: RegionReport},
  {path: 'time-share-reports', component: TimeShareReport},
  {path: 'search-keyword-reports', component: SearchKeywordReport},
  {path: 'platform-reports', component: PlatformReport},
  {path: 'network-reports', component: NetworkReport},
  {path: 'education-reports', component: EducationReport},
  {path: 'location-reports', component: LocationReport},
  {path: 'search-keyword-reports', component: SearchKeywordReport},
  {path: 'age-rang-report', component: AgeRangReport},
  {path: 'gender-report', component: GenderReport},
  {path: 'interest-type-report', component: InterestTypeReport},
  {path: 'operating-system-report', component: OperatingSystemReport},
  {path: 'intention-word-report', component: IntentionWordReport}
]

const menu = {
  title: '透视表导入',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '数据导入',
      icon: 'upload',
      path: '/operating-center/perspective-report/import',
      perm: 'financeKeywordReport:import',
      flag: false
    },
    {
      title: '导入日志',
      icon: 'list',
      path: '/operating-center/perspective-report-import-logs',
      perm: 'financePerspectiveReportImportLog:list',
      flag: false
    },
    {
      title: '关键词数据列表',
      icon: 'list',
      path: '/operating-center/keyword-reports',
      perm: 'financeKeywordReport:list',
      flag: false
    },
    {
      title: '地域数据列表',
      icon: 'list',
      path: '/operating-center/region-reports',
      perm: 'financeRegionReport:list',
      flag: false
    },
    {
      title: '时段数据列表',
      icon: 'list',
      path: '/operating-center/time-share-reports',
      perm: 'financeTimeShareReport:list',
      flag: false
    },
    {
      title: '搜索词数据列表',
      icon: 'list',
      path: '/operating-center/search-keyword-reports',
      perm: 'financeSearchKeywordReport:list',
      flag: false
    },
    {
      title: '年龄范围数据列表',
      icon: 'list',
      path: '/operating-center/age-rang-report',
      perm: 'ageRangeReport:list',
      flag: false
    },
    {
      title: '性别数据列表',
      icon: 'list',
      path: '/operating-center/gender-report',
      perm: 'genderReport:list',
      flag: false
    },
    {
      title: '兴趣分类数据列表',
      icon: 'list',
      path: '/operating-center/interest-type-report',
      perm: 'interestTypeReport:list',
      flag: false
    },
    {
      title: '操作系统数据列表',
      icon: 'list',
      path: '/operating-center/operating-system-report',
      perm: 'operatingSystemReport:list',
      flag: false
    },
    {
      title: '平台数据列表',
      icon: 'list',
      path: '/operating-center/platform-reports',
      perm: 'platformReport:list',
      flag: false
    },
    {
      title: '网络数据列表',
      icon: 'list',
      path: '/operating-center/network-reports',
      perm: 'networkReport:list',
      flag: false
    },
    {
      title: '学历数据列表',
      icon: 'list',
      path: '/operating-center/education-reports',
      perm: 'educationReport:list',
      flag: false
    },
    {
      title: '头条位置数据列表',
      icon: 'list',
      path: '/operating-center/location-reports',
      perm: 'locationReport:list',
      flag: false
    },
    {
      title: '意图词数据列表',
      icon: 'list',
      path: '/operating-center/intention-word-report',
      perm: 'intentionReport:list',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
