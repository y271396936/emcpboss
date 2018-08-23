const AccountDailyConsumption = () => import(/* webpackChunkName: "finances" */ '@/components/finance/account_consumption/AccountDailyConsumption')
const AccountDeviceConsumption = () => import(/* webpackChunkName: "finances" */ '@/components/finance/account_consumption/AccountDeviceConsumption')
const AccountMonthReport = () => import(/* webpackChunkName: "finances" */ '@/components/finance/account_consumption/AccountMonthReport')
const AccountMonthConsumptionLine = () => import(/* webpackChunkName: "finances" */ '@/components/finance/account_consumption/AccountMonthConsumptionLine')

const routers = [
  {path: 'account-consumption', component: AccountDailyConsumption},
  {path: 'account-consumption/device', component: AccountDeviceConsumption},
  {path: 'account-consumption/month-reports', component: AccountMonthReport},
  {path: 'account-consumption/account-month-consumption-line', component: AccountMonthConsumptionLine}
]

const menu = {
  title: '账户消费报表',
  icon: 'deviantart',
  flag: false,
  sons: [
    {
      title: '账户日总报表',
      icon: 'deviantart',
      path: '/finance/account-consumption',
      perm: 'analysisDailyConsumption:accountPlatform',
      flag: false
    },
    {
      title: '账户设备日消费报表',
      icon: 'deviantart',
      path: '/finance/account-consumption/device',
      perm: 'analysisDailyConsumption:accountDevice',
      flag: false
    },
    {
      title: '账户消费月报表',
      icon: 'deviantart',
      path: '/finance/account-consumption/month-reports',
      perm: 'analysisAccountPerformance:month',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
