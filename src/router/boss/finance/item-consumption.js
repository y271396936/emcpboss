const ItemDailyConsumption = () => import(/* webpackChunkName: "finances" */ '@/components/finance/item_consumption/ItemDailyConsumption')
const ItemPlatformConsumption = () => import(/* webpackChunkName: "finances" */ '@/components/finance/item_consumption/ItemPlatformConsumption')
const ItemDeviceConsumption = () => import(/* webpackChunkName: "finances" */ '@/components/finance/item_consumption/ItemDeviceConsumption')
const ItemPlanConsumption = () => import(/* webpackChunkName: "finances" */ '@/components/finance/item_consumption/ItemPlanConsumption')
const ItemMonthReport = () => import(/* webpackChunkName: "finances" */ '@/components/finance/item_consumption/ItemMonthReport')
const ItemPlatformMonthReport = () => import(/* webpackChunkName: "finances" */ '@/components/finance/item_consumption/ItemPlatformMonthReport')
const ItemMonthConsumptionLine = () => import(/* webpackChunkName: "finances" */ '@/components/finance/item_consumption/ItemMonthConsumptionLine')
const ItemPlatformMonthConsumptionLine = () => import(/* webpackChunkName: "finances" */ '@/components/finance/item_consumption/ItemPlatformMonthConsumptionLine')
const ItemChannelDailyConsumption = () => import(/* webpackChunkName: "finances" */ '@/components/finance/item_consumption/ItemChannelDailyConsumption')
const ItemChannelMonthConsumption = () => import(/* webpackChunkName: "finances" */ '@/components/finance/item_consumption/ItemChannelMonthConsumption')

const routers = [
  {path: 'item-consumption', component: ItemDailyConsumption},
  {path: 'item-consumption/platform', component: ItemPlatformConsumption},
  {path: 'item-consumption/device', component: ItemDeviceConsumption},
  {path: 'item-consumption/plan', component: ItemPlanConsumption},
  {path: 'item-consumption/month-reports', component: ItemMonthReport},
  {path: 'item-consumption/platform-month-reports', component: ItemPlatformMonthReport},
  {path: 'item-consumption/item-month-consumption-line', component: ItemMonthConsumptionLine},
  {path: 'item-consumption/item-platform-month-consumption-line', component: ItemPlatformMonthConsumptionLine},
  {path: 'item-consumption/item-channel-daily-consumption', component: ItemChannelDailyConsumption},
  {path: 'item-consumption/item-channel-month-consumption', component: ItemChannelMonthConsumption}
]

const menu = {
  title: '项目消费报表',
  icon: 'dashcube',
  flag: false,
  sons: [
    {
      title: '项目日总报表',
      icon: 'user-circle',
      path: '/finance/item-consumption',
      perm: 'analysisDailyConsumption:item',
      flag: false
    },
    {
      title: '项目平台日报表',
      icon: 'user-circle',
      path: '/finance/item-consumption/platform',
      perm: 'analysisDailyConsumption:itemPlatform',
      flag: false
    },
    {
      title: '项目设备日报表',
      icon: 'user-circle',
      path: '/finance/item-consumption/device',
      perm: 'analysisDailyConsumption:itemDevice',
      flag: false
    },
    {
      title: '项目计划日报表',
      icon: 'user-circle',
      path: '/finance/item-consumption/plan',
      perm: 'analysisDailyConsumption:itemPlan',
      flag: false
    },
    {
      title: '项目消费月报',
      icon: 'comments',
      path: '/finance/item-consumption/month-reports',
      perm: 'analysisItemPerformance:month',
      flag: false
    },
    {
      title: '项目平台消费月报',
      icon: 'comments',
      path: '/finance/item-consumption/platform-month-reports',
      perm: 'analysisItemPlatformPerformance:month',
      flag: false
    }, {
      title: '项目渠道消费日报',
      icon: 'user-circle',
      path: '/finance/item-consumption/item-channel-daily-consumption',
      perm: 'analysisChannelPerformance:daily',
      flag: false
    }, {
      title: '项目渠道消费月报',
      icon: 'user-circle',
      path: '/finance/item-consumption/item-channel-month-consumption',
      perm: 'analysisChannelMonthPerformance:month',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
