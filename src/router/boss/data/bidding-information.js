// 项目分析
const ItemRegion = () => import(/* webpackChunkName: "data-bid-group" */ '@/components/boss/data_analysis/total/item_analysis/ItemRegion')
const ItemProvince = () => import(/* webpackChunkName: "data-bid-group" */ '@/components/boss/data_analysis/total/item_analysis/ItemProvince')
const BackupItemRegion = () => import(/* webpackChunkName: "data-bid-group" */ '@/components/boss/data_analysis/total/item_analysis/BackupItemRegion')
const ItemTimeShare = () => import(/* webpackChunkName: "data-bid-group" */ '@/components/boss/data_analysis/total/item_analysis/ItemTimeShare')
const ItemRegionDaily = () => import(/* webpackChunkName: "data-bid-group" */ '@/components/boss/data_analysis/total/item_analysis/ItemRegionDaily')
const ItemRegionMonth = () => import(/* webpackChunkName: "data-bid-group" */ '@/components/boss/data_analysis/total/item_analysis/ItemRegionMonth')
// 行业分析
const IndustryDaily = () => import(/* webpackChunkName: "data-bid-group" */ '@/components/boss/data_analysis/total/industry_analysis/IndustryDaily')
const IndustryMonth = () => import(/* webpackChunkName: "data-bid-group" */ '@/components/boss/data_analysis/total/industry_analysis/IndustryMonth')
const IndustryRegionMonth = () => import(/* webpackChunkName: "data-bid-group" */ '@/components/boss/data_analysis/total/industry_analysis/IndustryRegionMonth')
// 大数据汇总
const ProvinceDaily = () => import(/* webpackChunkName: "data-bid-group" */ '@/components/boss/data_analysis/total/big_data/ProvinceDaily')
const ProvinceMonth = () => import(/* webpackChunkName: "data-bid-group" */ '@/components/boss/data_analysis/total/big_data/ProvinceMonth')
const CityDaily = () => import(/* webpackChunkName: "data-bid-group" */ '@/components/boss/data_analysis/total/big_data/CityDailyAnalysis')
const CityMonth = () => import(/* webpackChunkName: "data-bid-group" */ '@/components/boss/data_analysis/total/big_data/CityMonthAnalysis')

const routers = [
  {path: 'bid-info/item-region', component: ItemRegion},
  {path: 'bid-info/item-province', component: ItemProvince},
  {path: 'bid-info/backup-item-region', component: BackupItemRegion},
  {path: 'bid-info/item-time-share', component: ItemTimeShare},
  {path: 'bid-info/item-region-dailies', component: ItemRegionDaily},
  {path: 'bid-info/item-region-months', component: ItemRegionMonth},
  {path: 'bid-info/industry-dailies', component: IndustryDaily},
  {path: 'bid-info/industry-months', component: IndustryMonth},
  {path: 'bid-info/industry-region-months', component: IndustryRegionMonth},
  {path: 'bid-info/province-dailies', component: ProvinceDaily},
  {path: 'bid-info/province-months', component: ProvinceMonth},
  {path: 'bid-info/city-dailies', component: CityDaily},
  {path: 'bid-info/city-months', component: CityMonth}
]

const menu = {
  title: '竞价+信息流',
  flag: false,
  isShow: false,
  sons: [
    {
      title: '项目分析',
      flag: false,
      sons: [
        {
          title: '项目地域分析',
          path: '/data/bid-info/item-region',
          perm: 'analysisBidRegionConsumption:region',
          flag: false
        },
        {
          title: '项目时段分析',
          path: '/data/bid-info/item-time-share',
          perm: 'analysisBidTimeShareConsumption:timeShare',
          flag: false
        },
        {
          title: '项目地域日报',
          path: '/data/bid-info/item-region-dailies',
          perm: 'analysisItemRegion:itemRegionPerformance',
          flag: false
        },
        {
          title: '项目地域月报',
          path: '/data/bid-info/item-region-months',
          perm: 'analysisItemRegion:itemRegionPerformance',
          flag: false
        }
      ]
    },
    {
      title: '行业分析',
      flag: false,
      sons: [
        {
          title: '行业日报',
          path: '/data/bid-info/industry-dailies',
          perm: 'industryDataAnalyse:daily',
          flag: false
        },
        {
          title: '行业月报',
          path: '/data/bid-info/industry-months',
          perm: 'industryDataAnalyse:month',
          flag: false
        },
        {
          title: '行业地域月报',
          path: '/data/bid-info/industry-region-months',
          perm: 'analysisIndustryRegionPerformance:month',
          flag: false
        }
      ]
    },
    {
      title: '大数据汇总',
      flag: false,
      sons: [
        {
          title: '省份日报',
          path: '/data/bid-info/province-dailies',
          perm: 'provinceConsumption:daily',
          flag: false
        },
        {
          title: '省份月报',
          path: '/data/bid-info/province-months',
          perm: 'provinceConsumption:month',
          flag: false
        },
        {
          title: '城市日报',
          path: '/data/bid-info/city-dailies',
          perm: 'analysisRegionDataCity:daily',
          flag: false
        },
        {
          title: '城市月报',
          path: '/data/bid-info/city-months',
          perm: 'analysisRegionDataCity:month',
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
