// 主容器
import MainContent from '@/components/common/MainContent'
// 子容器
import ChannelAccountRebates from './channel-account-rebates'
import CustomerMoney from './customer-money'
import PlatformCoin from './platform-coin'
import ItemConsumption from './item-consumption'
import AccountConsumption from './account-consumption'
import PlatformConsumption from './platform-consumption'
import SalemanPerformance from './saleman-performance'

const router = {
  path: '/finance',
  name: 'Finance',
  component: MainContent,
  children: [
    ...ChannelAccountRebates.routers,
    ...CustomerMoney.routers,
    ...PlatformCoin.routers,
    ...ItemConsumption.routers,
    ...AccountConsumption.routers,
    ...PlatformConsumption.routers,
    ...SalemanPerformance.routers
  ]
}

const menu = [
  ChannelAccountRebates.menu,
  CustomerMoney.menu,
  PlatformCoin.menu,
  ItemConsumption.menu,
  AccountConsumption.menu,
  PlatformConsumption.menu,
  SalemanPerformance.menu
]

export default {
  router,
  menu
}
