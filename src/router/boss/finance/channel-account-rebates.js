const ChannelAccountRebatesRate = () => import(/* webpackChunkName: "finances" */'@/components/finance/ChannelAccountRebatesRate')
const ClientRebateRate = () => import(/* webpackChunkName: "finances" */'@/components/operating_center/client_manager/ClientRebateRate')

const routers = [
  {path: 'channel-account-rebates-rates', component: ChannelAccountRebatesRate},
  {path: 'client-rebate-rates', component: ClientRebateRate}
]

const menu = {
  title: '返点率',
  icon: 'circle',
  flag: false,
  sons: [{
    title: '推广平台返点率',
    icon: 'bullseye',
    path: '/finance/channel-account-rebates-rates',
    perm: 'financeChannelAccountRebatesRate:list',
    flag: false
  }, {
    title: '客户返点率',
    icon: 'bullseye',
    path: '/finance/client-rebate-rates',
    perm: 'projectRebatesRate:list',
    flag: false
  }]
}

export default {
  routers,
  menu
}
