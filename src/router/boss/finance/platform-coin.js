const ChannelAccountCoin = () => import(/* webpackChunkName: "finances" */ '@/components/finance/platform_coin/ChannelAccountCoin')
const ChannelAccountPayment = () => import(/* webpackChunkName: "finances" */ '@/components/finance/platform_coin/ChannelAccountPayment')

const routers = [
  {path: 'channel-account-coins', component: ChannelAccountCoin},
  {path: 'channel-account-payments', component: ChannelAccountPayment}
]

const menu = {
  title: '平台款项',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '账户余额',
      icon: 'money',
      path: '/finance/channel-account-coins',
      perm: 'financeChannelAccountCoin:list',
      flag: false
    },
    {
      title: '平台打款记录',
      icon: 'shopping-cart',
      path: '/finance/channel-account-payments',
      perm: 'financeChannelAccountPayment:list',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
