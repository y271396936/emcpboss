const FeedbackReport = () => import(/* webpackChunkName: "operating-analysis" */ '@/components/data/bid/FeedbackReport')
const TimeNodeReport = () => import(/* webpackChunkName: "operating-analysis" */ '@/components/data/bid/TimeNodeReport')
const BidAdjustReport = () => import(/* webpackChunkName: "operating-analysis" */ '@/components/data/bid/BidAdjustReport')
const ItemBudget = () => import(/* webpackChunkName: "operating-analysis" */ '@/components/data/bid/ItemBudget')
const ChannelConsumption = () => import(/* webpackChunkName: "operating-analysis" */ '@/components/data/bid/ChannelConsumption')
const ChannelConsumptionDaily = () => import(/* webpackChunkName: "operating-analysis" */ '@/components/data/bid/ChannelConsumptionDaily')

const routers = [
  {path: 'feedback-reports', component: FeedbackReport},
  {path: 'time-node-reports', component: TimeNodeReport},
  {path: 'bid-adjust-reports', component: BidAdjustReport},
  {path: 'item-budgets', component: ItemBudget},
  {path: 'channel-consumptions', component: ChannelConsumption},
  {path: 'channel-consumption-dailies', component: ChannelConsumptionDaily}
]

const menu = {
  title: '运营报告',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '留言数据报告',
      icon: 'comments',
      path: '/operating-center/feedback-reports',
      perm: 'analysisFeedback:itemSolution',
      flag: false
    },
    {
      title: '节点数据报告',
      icon: 'clock-o',
      path: '/operating-center/time-node-reports',
      perm: 'analysisItemSolutionTimeNodeReport:list',
      flag: false
    },
    {
      title: '运营数据报告',
      icon: 'magic',
      path: '/operating-center/bid-adjust-reports',
      perm: 'analysisAdjust:list',
      flag: false
    },
    {
      title: '项目预算报告',
      icon: 'money',
      path: '/operating-center/item-budgets',
      perm: 'analysisAdjustItemBudget:list',
      flag: false
    },
    {
      title: '渠道消费汇总报告',
      icon: 'road',
      path: '/operating-center/channel-consumptions',
      perm: 'analysisBidConsumptionReport:channelClient',
      flag: false
    },
    {
      title: '渠道消费达标日报',
      icon: 'road',
      path: '/operating-center/channel-consumption-dailies',
      perm: 'analysisBidConsumptionReport:channelClientDaily',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
