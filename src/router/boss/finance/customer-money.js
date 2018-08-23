const ItemPayment = () => import(/* webpackChunkName: "finances" */ '@/components/finance/customer_money/ItemPayment')
const ItemMoney = () => import(/* webpackChunkName: "finances" */ '@/components/finance/customer_money/ItemMoney')
const ItemMoneyTransferLog = () => import(/* webpackChunkName: "finances" */ '@/components/finance/customer_money/ItemMoneyTransferLog')
const ItemMoneyRefundLog = () => import(/* webpackChunkName: "finances" */ '@/components/finance/customer_money/ItemMoneyRefundLog')

const routers = [
  {path: 'item-payments', component: ItemPayment},
  {path: 'item-moneys', component: ItemMoney},
  {path: 'item-money/transfer-logs', component: ItemMoneyTransferLog},
  {path: 'item-money/refund-logs', component: ItemMoneyRefundLog}
]

const menu = {
  title: '客户款项',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '客户付款',
      icon: 'credit-card',
      path: '/finance/item-payments',
      perm: 'financeItemPayment:list',
      flag: false
    },
    {
      title: '客户项目余额',
      icon: 'money',
      path: '/finance/item-moneys',
      perm: 'financeItemMoney:list',
      flag: false
    },
    {
      title: '余额转出记录',
      icon: 'retweet',
      path: '/finance/item-money/transfer-logs',
      perm: 'financeItemMoney:transferList',
      flag: false
    },
    {
      title: '退款记录',
      icon: 'share-square-o',
      path: '/finance/item-money/refund-logs',
      perm: 'financeItemMoney:refundList',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
