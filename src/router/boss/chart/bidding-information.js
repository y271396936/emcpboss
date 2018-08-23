// 账户分析
const AccountCityPie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/total/account/CityPie')
const AccountProvincePie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/total/account/ProvincePie')
const AccountTimeSharePie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/total/account/TimeSharePie')
// 项目分析
const RegionProvincePie = () => import(/* webpackChunkName: "bidding-informatins" */ '@/components/boss/chart/total/item/ItemRegionProvincePie')
const RegionCityPie = () => import(/* webpackChunkName: "bidding-informatins" */ '@/components/boss/chart/total/item/ItemRegionCityPie')
// 行业分析
const IndustryMonthPie = () => import(/* webpackChunkName: "bidding-informatins" */ '@/components/boss/chart/total/industry/IndustryMonthPie')
const RegionHistogram = () => import(/* webpackChunkName: "bidding-informatins" */ '@/components/boss/chart/total/industry/IndustryRegionHistogram')
const RegionPie = () => import(/* webpackChunkName: "bidding-informatins" */ '@/components/boss/chart/total/industry/IndustryRegionPie')
// 总数据分析
const ProvinceDataPie = () => import(/* webpackChunkName: "bidding-informatins" */ '@/components/boss/chart/total/big_data/ProvinceDataPie')
const CityDataPie = () => import(/* webpackChunkName: "bidding-informatins" */ '@/components/boss/chart/total/big_data/CityDataPie')
const TotalDataPie = () => import(/* webpackChunkName: "bidding-informatins" */ '@/components/boss/chart/total/big_data/TotalDataPie')

const routers = [
  {path: 'bid-info/platform-city/pies', component: AccountCityPie},
  {path: 'bid-info/platform-province/pies', component: AccountProvincePie},
  {path: 'bid-info/platform-time-share/pies', component: AccountTimeSharePie},
  {path: 'bid-info/item-region/province/pies', component: RegionProvincePie},
  {path: 'bid-info/item-region/city/pies', component: RegionCityPie},
  {path: 'bid-info/industry-region/pies', component: RegionPie},
  {path: 'bid-info/industry-month/pies', component: IndustryMonthPie},
  {path: 'bid-info/industry-region/histograms', component: RegionHistogram},
  {path: 'bid-info/industry-region/pies', component: RegionPie},
  {path: 'bid-info/total-data/pies', component: TotalDataPie},
  {path: 'bid-info/province/pies', component: ProvinceDataPie},
  {path: 'bid-info/city/pies', component: CityDataPie}
]

const menu = {
  title: '竞价+信息流',
  flag: false,
  isShow: false,
  sons: [
    {
      title: '账户分析',
      flag: false,
      sons: [
        {
          title: '省份占比图',
          path: '/chart/bid-info/platform-province/pies',
          perm: 'analysisItemRegion:getPlatformProvincePie',
          flag: false
        },
        {
          title: '城市占比图',
          path: '/chart/bid-info/platform-city/pies',
          perm: 'analysisItemRegion:getPlatformCityPie',
          flag: false
        },
        {
          title: '分时占比图',
          path: '/chart/bid-info/platform-time-share/pies',
          perm: 'analysisItemTimeSharePie:accountTimeSharePie',
          flag: false
        }
      ]
    },
    {
      title: '项目分析',
      flag: false,
      sons: [
        {
          title: '省份占比图',
          path: '/chart/bid-info/item-region/province/pies',
          perm: 'analysisItemRegion:itemRegionCostCoin',
          flag: false
        },
        {
          title: '城市占比图',
          path: '/chart/bid-info/item-region/city/pies',
          perm: 'analysisItemRegion:itemRegionChart',
          flag: false
        }
      ]
    },
    {
      title: '行业分析',
      flag: false,
      sons: [
        {
          title: '行业月占比图',
          path: '/chart/bid-info/industry-month/pies',
          perm: 'industryDataAnalyse:monthPie',
          flag: false
        },
        {
          title: '地域柱状图',
          path: '/chart/bid-info/industry-region/histograms',
          perm: 'analysisItemRegion:itemRegionHistogramChart',
          flag: false
        },
        {
          title: '地域占比图',
          path: '/chart/bid-info/industry-region/pies',
          perm: 'analysisIndustryRegionPerformance:pie',
          flag: false
        }
      ]
    },
    {
      title: '总数据分析',
      flag: false,
      sons: [
        {
          title: '总数据汇总图',
          path: '/chart/bid-info/total-data/pies',
          perm: 'natureDataAnalyse:monthPie',
          flag: false
        },
        {
          title: '省份月占比图',
          path: '/chart/bid-info/province/pies',
          perm: 'provinceConsumption:pie',
          flag: false
        },
        {
          title: '城市月占比图',
          path: '/chart/bid-info/city/pies',
          perm: 'analysisRegionDataCity:pie',
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
