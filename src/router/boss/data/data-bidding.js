// 账户分析
const ItemKeyword = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/account_analysis/ItemKeyword')
const BackupItemKeyword = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/account_analysis/BackupItemKeyword')
const ItemSearchKeyword = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/account_analysis/ItemSearchKeyword')
const BackupItemSearchKeyword = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/account_analysis/BackupItemSearchKeyword')
const ItemAccount = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/account_analysis/ItemAccount')
const ItemRegion = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/account_analysis/ItemRegion')
const ItemProvince = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/account_analysis/ItemProvince')
const BackupItemRegion = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/account_analysis/BackupItemRegion')
const ItemTimeShare = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/account_analysis/ItemTimeShare')
// 项目分析
const ItemNature = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/item_analysis/ItemNature')
const ItemNatureDaily = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/item_analysis/ItemNatureDaily')
const ItemNatureMonth = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/item_analysis/ItemNatureMonth')
const ItemRegionDaily = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/item_analysis/ItemRegionDaily')
const ItemRegionMonth = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/item_analysis/ItemRegionMonth')
// 行业分析
const IndustryDaily = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/industry_analysis/IndustryDaily')
const IndustryMonth = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/industry_analysis/IndustryMonth')
const IndustryNatureMonth = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/industry_analysis/IndustryNatureMonth')
const IndustryRegionMonth = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/industry_analysis/IndustryRegionMonth')
// 大数据汇总
const ProvinceDaily = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/big_data/ProvinceDailyAnalysis')
const ProvinceMonth = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/big_data/ProvinceMonthAnalysis')
const CityDaily = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/big_data/CityDailyAnalysis')
const CityMonth = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/big_data/CityMonthAnalysis')
const KeywordNatureDaily = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/big_data/KeywordNatureDaily')
const KeywordNatureMonth = () => import(/* webpackChunkName: "datas-bidding-flows" */ '@/components/boss/data_analysis/bid/big_data/KeywordNatureMonth')

const routers = [
  {path: 'bid/item-keywords', component: ItemKeyword},
  {path: 'bid/backup-item-keywords', component: BackupItemKeyword},
  {path: 'bid/item-search-keywords', component: ItemSearchKeyword},
  {path: 'bid/backup-item-search-keywords', component: BackupItemSearchKeyword},
  {path: 'bid/item-accounts', component: ItemAccount},
  {path: 'bid/item-region', component: ItemRegion},
  {path: 'bid/backup-item-region', component: BackupItemRegion},
  {path: 'bid/item-province', component: ItemProvince},
  {path: 'bid/item-time-share', component: ItemTimeShare},
  {path: 'bid/item-natures', component: ItemNature},
  {path: 'bid/item-nature-dailies', component: ItemNatureDaily},
  {path: 'bid/item-nature-months', component: ItemNatureMonth},
  {path: 'bid/item-region-dailies', component: ItemRegionDaily},
  {path: 'bid/item-region-months', component: ItemRegionMonth},
  {path: 'bid/industry-dailies', component: IndustryDaily},
  {path: 'bid/industry-months', component: IndustryMonth},
  {path: 'bid/industry-nature-months', component: IndustryNatureMonth},
  {path: 'bid/industry-region-months', component: IndustryRegionMonth},
  {path: 'bid/province-dailies', component: ProvinceDaily},
  {path: 'bid/province-months', component: ProvinceMonth},
  {path: 'bid/city-dailies', component: CityDaily},
  {path: 'bid/city-months', component: CityMonth},
  {path: 'bid/keyword-nature-dailies', component: KeywordNatureDaily},
  {path: 'bid/keyword-nature-months', component: KeywordNatureMonth}
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
          title: '账户关键词分析',
          path: '/data/bid/item-keywords',
          perm: 'financeKeywordReport:list',
          flag: false
        },
        {
          title: '账户搜索词分析',
          path: '/data/bid/item-search-keywords',
          perm: 'analysisSearchKeywordConsumption:search',
          flag: false
        },
        {
          title: '账户词性分析',
          path: '/data/bid/item-accounts',
          perm: 'analysisBidKeywordConsumption:account',
          flag: false
        },
        {
          title: '账户地域分析',
          path: '/data/bid/item-region',
          perm: 'analysisBidRegionConsumption:region',
          flag: false
        },
        {
          title: '账户时段分析',
          path: '/data/bid/item-time-share',
          perm: 'analysisBidTimeShareConsumption:timeShare',
          flag: false
        }
      ]
    },
    {
      title: '项目分析',
      flag: false,
      sons: [
        {
          title: '项目词性分析',
          path: '/data/bid/item-natures',
          perm: 'analysisBidKeywordConsumption:item',
          flag: false
        },
        {
          title: '项目词性日报',
          path: '/data/bid/item-nature-dailies',
          perm: 'analysisItemKeyword:itemNatureDay',
          flag: false
        },
        {
          title: '项目词性月报',
          path: '/data/bid/item-nature-months',
          perm: 'analysisItemKeyword:itemNaturePerformance',
          flag: false
        },
        {
          title: '项目地域日报',
          path: '/data/bid/item-region-dailies',
          perm: 'analysisItemRegion:provinceCityDay',
          flag: false
        },
        {
          title: '项目地域月报',
          path: '/data/bid/item-region-months',
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
          path: '/data/bid/industry-dailies',
          perm: 'industryDataAnalyse:daily',
          flag: false
        },
        {
          title: '行业月报',
          path: '/data/bid/industry-months',
          perm: 'industryDataAnalyse:month',
          flag: false
        },
        {
          title: '行业词性月报',
          path: '/data/bid/industry-nature-months',
          perm: 'analysisIndustryKeywordPerformance:month',
          flag: false
        },
        {
          title: '行业地域月报',
          path: '/data/bid/industry-region-months',
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
          path: '/data/bid/province-dailies',
          perm: 'provinceConsumption:daily',
          flag: false
        },
        {
          title: '省份月报',
          path: '/data/bid/province-months',
          perm: 'provinceConsumption:month',
          flag: false
        },
        {
          title: '城市日报',
          path: '/data/bid/city-dailies',
          perm: 'analysisRegionDataCity:daily',
          flag: false
        },
        {
          title: '城市月报',
          path: '/data/bid/city-months',
          perm: 'analysisRegionDataCity:month',
          flag: false
        },
        {
          title: '词性日报',
          path: '/data/bid/keyword-nature-dailies',
          perm: 'natureDataAnalyse:daily',
          flag: false
        },
        {
          title: '词性月报',
          path: '/data/bid/keyword-nature-months',
          perm: 'natureDataAnalyse:month',
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
