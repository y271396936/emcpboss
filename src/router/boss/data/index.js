// 主容器
import MainContent from '@/components/common/MainContent'
// 子容器
import DataBidding from './data-bidding'
import FlowInformation from './flow-information'
import BiddingInformation from './bidding-information'

const router = {
  path: '/data',
  name: 'Data',
  component: MainContent,
  children: [
    ...DataBidding.routers,
    ...FlowInformation.routers,
    ...BiddingInformation.routers
  ]
}

const menu = [
  DataBidding.menu,
  FlowInformation.menu,
  BiddingInformation.menu
]

export default {
  router,
  menu
}
