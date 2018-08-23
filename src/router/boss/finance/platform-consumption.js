const PlatformConsumptionDaily = () => import(/* webpackChunkName: "finances" */ '@/components/finance/platform_consumption/PlatformConsumptionDaily')
const PlatformDailyConsumptionLine = () => import(/* webpackChunkName: "finances" */ '@/components/finance/platform_consumption/PlatformDailyConsumptionLine')
const PlatformConsumptionMonth = () => import(/* webpackChunkName: "finances" */ '@/components/finance/platform_consumption/PlatformConsumptionMonth')
const ChannelConsumptionDaily = () => import(/* webpackChunkName: "finances" */ '@/components/finance/platform_consumption/ChannelConsumptionDaily')
const ChannelConsumptionMonth = () => import(/* webpackChunkName: "finances" */ '@/components/finance/platform_consumption/ChannelConsumptionMonth')

const routers = [
  {path: 'platform-consumption', component: PlatformConsumptionDaily},
  {path: 'platform-daily-consumption-line', component: PlatformDailyConsumptionLine},
  {path: 'platform-consumption-month', component: PlatformConsumptionMonth},
  {path: 'channel-consumption-daily', component: ChannelConsumptionDaily},
  {path: 'channel-consumption-month', component: ChannelConsumptionMonth}
]

const menu = {
  title: '平台消费报表',
  icon: 'desktop',
  flag: false,
  sons: [
    {
      title: '平台消费日报',
      icon: 'comments',
      path: '/finance/platform-consumption',
      perm: 'analysisPlatformPerformance:daily',
      flag: false
    }, {
      title: '平台消费月报',
      icon: 'comments',
      path: '/finance/platform-consumption-month',
      perm: 'analysisItemPlatformPerformance:month',
      flag: false
    }, {
      title: '渠道消费日报',
      icon: 'comments',
      path: '/finance/channel-consumption-daily',
      perm: 'analysisChannelTypePerformance:daily',
      flag: false
    }, {
      title: '渠道消费月报',
      icon: 'comments',
      path: '/finance/channel-consumption-month',
      perm: 'analysisChannelTypePerformance:month',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
