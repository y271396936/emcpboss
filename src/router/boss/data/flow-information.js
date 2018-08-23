// 账户分析
const IntentionAnalysis = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/analysis/IntentionAnalysis')
const ClientSystemAnalysis = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/analysis/ClientSystemAnalysis')
const SexAnalysis = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/analysis/SexAnalysis')
const RegionAnalysis = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/analysis/RegionAnalysis')
const ProvinceAnalysis = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/analysis/ProvinceAnalysis')
const BackupRegionAnalysis = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/analysis/BackupRegionAnalysis')
const TimeSharingAnalysis = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/analysis/TimeSharingAnalysis')
const AgeAnalysis = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/analysis/AgeAnalysis')
const HobbyAnalysis = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/analysis/HobbyAnalysis')
const EducationAnalysis = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/analysis/EducationAnalysis')
const NetworkAnalysis = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/analysis/NetworkAnalysis')
const LocationAnalysis = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/analysis/LocationAnalysis')
// 日月报
const TimeShareDailyReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/TimeShareDailyReport')
const TimeShareMonthReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/TimeShareMonthReport')
const NetworkDailyReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/NetworkDailyReport')
const NetworkMonthReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/NetworkMonthReport')
const RegionDailyReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/RegionDailyReport')
const RegionMonthRepoet = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/RegionMonthRepoet')
const GenderDailyReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/GenderDailyReport')
const GenderMonthReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/GenderMonthReport')
const EducationDailyReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/EducationDailyReport')
const EducationMonthReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/EducationMonthReport')
const AgeDailyReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/AgeDailyReport')
const AgeMonthReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/AgeMonthReport')
const InterestDailyReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/InterestDailyReport')
const InterestMonthReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/InterestMonthReport')
const IntentionWordDailyReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/IntentionWordDailyReport')
const IntentionWordMonthReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/IntentionWordMonthReport')
const LocationDailyReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/LocationDailyReport')
const LocationMonthReport = () => import(/* webpackChunkName: "flow-info-group" */ '@/components/boss/data_analysis/info_flow/report/LocationMonthReport')

const routers = [
  {path: 'info-flow/intention-analysis', component: IntentionAnalysis},
  {path: 'info-flow/client-system-analysis', component: ClientSystemAnalysis},
  {path: 'info-flow/sex-analysis', component: SexAnalysis},
  {path: 'info-flow/region-analysis', component: RegionAnalysis},
  {path: 'info-flow/province-analysis', component: ProvinceAnalysis},
  {path: 'info-flow/backup-region-analysis', component: BackupRegionAnalysis},
  {path: 'info-flow/time-sharing-analysis', component: TimeSharingAnalysis},
  {path: 'info-flow/age-analysis', component: AgeAnalysis},
  {path: 'info-flow/hobby-analysis', component: HobbyAnalysis},
  {path: 'info-flow/education-analysis', component: EducationAnalysis},
  {path: 'info-flow/network-analysis', component: NetworkAnalysis},
  {path: 'info-flow/location-analysis', component: LocationAnalysis},
  {path: 'info-flow/time-share-daily-report', component: TimeShareDailyReport},
  {path: 'info-flow/time-Share-month-report', component: TimeShareMonthReport},
  {path: 'info-flow/network-daily-report', component: NetworkDailyReport},
  {path: 'info-flow/network-month-report', component: NetworkMonthReport},
  {path: 'info-flow/region-daily-report', component: RegionDailyReport},
  {path: 'info-flow/region-month-report', component: RegionMonthRepoet},
  {path: 'info-flow/gender-daily-report', component: GenderDailyReport},
  {path: 'info-flow/gender-month-report', component: GenderMonthReport},
  {path: 'info-flow/education-daily-report', component: EducationDailyReport},
  {path: 'info-flow/education-month-report', component: EducationMonthReport},
  {path: 'info-flow/age-daily-report', component: AgeDailyReport},
  {path: 'info-flow/age-month-report', component: AgeMonthReport},
  {path: 'info-flow/interest-daily-report', component: InterestDailyReport},
  {path: 'info-flow/interest-month-report', component: InterestMonthReport},
  {path: 'info-flow/intention-word-daily-report', component: IntentionWordDailyReport},
  {path: 'info-flow/intention-word-month-report', component: IntentionWordMonthReport},
  {path: 'info-flow/location-daily-report', component: LocationDailyReport},
  {path: 'info-flow/location-month-report', component: LocationMonthReport}
]

const menu = {
  title: '信息流',
  flag: false,
  isShow: false,
  sons: [
    {
      title: '账户分析',
      flag: false,
      sons: [
        {
          title: '分时分析',
          path: '/data/info-flow/time-sharing-analysis',
          perm: 'analysisInformationTime:list',
          flag: false
        },
        {
          title: '网络分析',
          path: '/data/info-flow/network-analysis',
          perm: 'informationNetReport:list',
          flag: false
        },
        {
          title: '地域分析',
          path: '/data/info-flow/region-analysis',
          perm: 'analysisInformationRegion:list',
          flag: false
        },
        {
          title: '性别分析',
          path: '/data/info-flow/sex-analysis',
          perm: 'analysisBidSex:list',
          flag: false
        },
        {
          title: '学历分析',
          path: '/data/info-flow/education-analysis',
          perm: 'informationEducationReport:list',
          flag: false
        },
        {
          title: '年龄分析',
          path: '/data/info-flow/age-analysis',
          perm: 'informationAgeReport:list',
          flag: false
        },
        {
          title: '兴趣分析',
          path: '/data/info-flow/hobby-analysis',
          perm: 'informationHobbyReport:list',
          flag: false
        },
        {
          title: '意图词分析',
          path: '/data/info-flow/intention-analysis',
          perm: 'itemInfoFlowIntentionAnalysis:list',
          flag: false
        },
        {
          title: '头条位置分析',
          path: '/data/info-flow/location-analysis',
          perm: 'locationReport:analyse',
          flag: false
        },
        {
          title: '设备/操作系统分析',
          path: '/data/info-flow/client-system-analysis',
          perm: 'clientSystem:list',
          flag: false
        }
      ]
    },
    {
      title: '日月报',
      flag: false,
      sons: [
        {
          title: '分时日报',
          path: '/data/info-flow/time-share-daily-report',
          perm: 'infoFlowlistAnalysisTime:list',
          flag: false
        },
        {
          title: '分时月报',
          path: '/data/info-flow/time-share-month-report',
          perm: 'timeShareMonthReport:list',
          flag: false
        },
        {
          title: '网络日报',
          path: '/data/info-flow/network-daily-report',
          perm: 'networkInfoFlowDayReport:list',
          flag: false
        },
        {
          title: '网络月报',
          path: '/data/info-flow/network-month-report',
          perm: 'networkReport:getMonthReport',
          flag: false
        },
        {
          title: '地域日报',
          path: '/data/info-flow/region-daily-report',
          perm: 'regionInfoFlowDayReport:list',
          flag: false
        },
        {
          title: '地域月报',
          path: '/data/info-flow/region-month-report',
          perm: 'regionReport:monthReports',
          flag: false
        },
        {
          title: '性别日报',
          path: '/data/info-flow/gender-daily-report',
          perm: 'genderInfoFlowDayReport:list',
          flag: false
        },
        {
          title: '性别月报',
          path: '/data/info-flow/gender-month-report',
          perm: 'genderMonthReport:list',
          flag: false
        },
        {
          title: '学历日报',
          path: '/data/info-flow/education-daily-report',
          perm: 'educationInfoFlowDayReport:list',
          flag: false
        },
        {
          title: '学历月报',
          path: '/data/info-flow/education-month-report',
          perm: 'educationReport:monthReports',
          flag: false
        },
        {
          title: '年龄日报',
          path: '/data/info-flow/age-daily-report',
          perm: 'ageInfoFlowDayReport:list',
          flag: false
        },
        {
          title: '年龄月报',
          path: '/data/info-flow/age-month-report',
          perm: 'ageInfoFlowMonthReport:list',
          flag: false
        },
        {
          title: '兴趣日报',
          path: '/data/info-flow/interest-daily-report',
          perm: 'interestTypeInfoFlowDayReport:list',
          flag: false
        },
        {
          title: '兴趣月报',
          path: '/data/info-flow/interest-month-report',
          perm: 'interestTypeReport:monthReports',
          flag: false
        },
        {
          title: '意图词日报',
          path: '/data/info-flow/intention-word-daily-report',
          perm: 'intentionInfoFlowDayReport:list',
          flag: false
        },
        {
          title: '意图词月报',
          path: '/data/info-flow/intention-word-month-report',
          perm: 'intentionReport:getMonthReport',
          flag: false
        },
        {
          title: '头条位置日报',
          path: '/data/info-flow/location-daily-report',
          perm: 'locationReport:getDailyReport',
          flag: false
        },
        {
          title: '头条位置月报',
          path: '/data/info-flow/location-month-report',
          perm: 'locationReport:getMonthReport',
          flag: false
        }
      ]
    }
  ]
}

export default {
  routers,
  menu
}
