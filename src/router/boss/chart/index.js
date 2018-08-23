// 主容器
import MainContent from '@/components/common/MainContent'
// 子容器
import ChartBidding from './chart-bidding'
import FlowInformation from './flow-information'
import BiddingInformation from './bidding-information'

const router = {
  path: '/chart',
  name: 'Chart',
  component: MainContent,
  children: [
    ...ChartBidding.routers,
    ...FlowInformation.routers,
    ...BiddingInformation.routers
  ]
}

const menu = [
  ChartBidding.menu,
  FlowInformation.menu,
  BiddingInformation.menu
]

export default {
  router,
  menu
}
