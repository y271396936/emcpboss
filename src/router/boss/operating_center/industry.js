const ItemIndustry = () => import(/* webpackChunkName: "inustrys" */ '@/components/operating_center/industry/ItemIndustry')
const IndustryExtensionWord = () => import(/* webpackChunkName: "inustrys" */ '@/components/operating_center/industry/IndustryExtensionWord')
const IndustryPrivativeWord = () => import(/* webpackChunkName: "inustrys" */ '@/components/operating_center/industry/IndustryPrivativeWord')

const routers = [
  {path: 'item-industries', component: ItemIndustry},
  {path: 'industry-extendsion-words', component: IndustryExtensionWord},
  {path: 'industry-privative-words', component: IndustryPrivativeWord}
]

const menu = {
  title: '行业管理',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '行业分类',
      icon: 'glass',
      path: '/operating-center/item-industries',
      perm: 'basicItemIndustry:list',
      flag: false
    }, {
      title: '行业推广词策略',
      icon: 'glass',
      path: '/operating-center/industry-extendsion-words',
      perm: 'basicIndustryKeywordStrategy:list',
      flag: false
    }, {
      title: '行业否定词策略',
      icon: 'glass',
      path: '/operating-center/industry-privative-words',
      perm: 'basicIndustryNegativeKeyword:list',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
