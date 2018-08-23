// 账户分析
const AccountCityPie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/account/CityPie')
const AccountProvincePie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/account/ProvincePie')
const itemNaturePie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/account/ItemNaturePie')
const AccountTimeSharePie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/account/TimeSharePie')
// 项目分析
const NatureHistogram = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/item/ItemNatureHistogram')
const NaturePie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/item/ItemNaturePie')
const RegionHistogram = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/item/ItemRegionHistogram')
const RegionProvincePie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/item/ItemRegionProvincePie')
const RegionCityPie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/item/ItemRegionCityPie')
// 行业分析
const IndustryNatureHistogram = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/industry/IndustryNatureHistogram')
const NaturePies = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/industry/IndustryNaturePie')
const IndustryMonthPie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/industry/IndustryMonthPie')
const IndustryRegionPie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/industry/IndustryRegionPie')
const IndustryRegionHistogram = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/industry/IndustryRegionHistogram')
// 总数据分析
const TotalDataPie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/big_data/TotalDataPie')
const KeywordNatureMonthPie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/big_data/KeywordNatureMonthPie')
const ProvinceDataPie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/big_data/ProvinceDataPie')
const CityDataPie = () => import(/* webpackChunkName: "chart-biddings" */ '@/components/boss/chart/bid/big_data/CityDataPie')

const routers = [
  {path: 'bid/platform-city/pies', component: AccountCityPie},
  {path: 'bid/platform-province/pies', component: AccountProvincePie},
  {path: 'bid/platform-time-share/pies', component: AccountTimeSharePie},
  {path: 'bid/item-nature/histograms', component: NatureHistogram},
  {path: 'bid/item-nature/pies', component: NaturePie},
  {path: 'bid/item-region/histograms', component: RegionHistogram},
  {path: 'bid/item-region/province/pies', component: RegionProvincePie},
  {path: 'bid/item-region/city/pies', component: RegionCityPie},
  {path: 'bid/industry-month/pies', component: IndustryMonthPie},
  {path: 'bid/industry-nature/histograms', component: IndustryNatureHistogram},
  {path: 'bid/industry-nature/pies', component: NaturePies},
  {path: 'bid/industry-region/histograms', component: IndustryRegionHistogram},
  {path: 'bid/industry-region/pies', component: IndustryRegionPie},
  {path: 'bid/total-data/pies', component: TotalDataPie},
  {path: 'bid/keyword-nature-month/pies', component: KeywordNatureMonthPie},
  {path: 'bid/province/pies', component: ProvinceDataPie},
  {path: 'bid/city/pies', component: CityDataPie},
  {path: 'bid/item-nature-pies/pies', component: itemNaturePie}
]

const menu = {
  title: '竞价',
  flag: false,
  isShow: false,
  sons: [
    {
      title: '账户分析',
      flag: false,
      sons: [
        {
          title: '省份占比图',
          path: '/chart/bid/platform-province/pies',
          perm: 'analysisItemRegion:getPlatformProvincePie',
          flag: false
        },
        {
          title: '城市占比图',
          path: '/chart/bid/platform-city/pies',
          perm: 'analysisItemRegion:getPlatformCityPie',
          flag: false
        },
        {
          title: '词性占比图',
          path: '/chart/bid/item-nature-pies/pies',
          perm: 'itemAccountKeywordDailyConsumptions:pie',
          flag: false
        },
        {
          title: '分时占比图',
          path: '/chart/bid/platform-time-share/pies',
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
          title: '词性柱状图',
          path: '/chart/bid/item-nature/histograms',
          perm: 'analysisItemKeyword:itemNatureHistogramChart',
          flag: false
        },
        {
          title: '词性占比图',
          path: '/chart/bid/item-nature/pies',
          perm: 'analysisItemKeyword:itemNatureChart',
          flag: false
        },
        {
          title: '地域柱状图',
          path: '/chart/bid/item-region/histograms',
          perm: 'analysisItemRegion:itemRegionHistogramChart',
          flag: false
        },
        {
          title: '省份占比图',
          path: '/chart/bid/item-region/province/pies',
          perm: 'analysisItemRegion:itemRegionCostCoin',
          flag: false
        },
        {
          title: '城市占比图',
          path: '/chart/bid/item-region/city/pies',
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
          path: '/chart/bid/industry-month/pies',
          perm: 'industryDataAnalyse:monthPie',
          flag: false
        },
        {
          title: '词性柱状图',
          path: '/chart/bid/industry-nature/histograms',
          perm: 'analysisIndustryKeywordPerformance:pillar',
          flag: false
        },
        {
          title: '词性占比图',
          path: '/chart/bid/industry-nature/pies',
          perm: 'analysisItemKeyword:itemNatureChart',
          flag: false
        },
        {
          title: '地域柱状图',
          path: '/chart/bid/industry-region/histograms',
          perm: 'analysisItemRegion:itemRegionHistogramChart',
          flag: false
        },
        {
          title: '地域占比图',
          path: '/chart/bid/industry-region/pies',
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
          path: '/chart/bid/total-data/pies',
          perm: 'natureDataAnalyse:monthPie',
          flag: false
        },
        {
          title: '词性月占比图',
          path: '/chart/bid/keyword-nature-month/pies',
          perm: 'natureDataAnalyse:monthPie',
          flag: false
        },
        {
          title: '省份月占比图',
          path: '/chart/bid/province/pies',
          perm: 'provinceConsumption:pie',
          flag: false
        },
        {
          title: '城市月占比图',
          path: '/chart/bid/city/pies',
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
