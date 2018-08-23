const Channel = () => import(/* webpackChunkName: "all-operating-centers" */ '@/components/operating_center/channel/Channel')
const ChannelAccount = () => import(/* webpackChunkName: "all-operating-centers" */ '@/components/operating_center/channel/ChannelAccount')

const routers = [
  {path: 'channels', component: Channel},
  {path: 'channel-accounts', component: ChannelAccount}
]

const menu = {
  title: '平台渠道',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '平台账户',
      icon: 'road',
      path: '/operating-center/channel-accounts',
      perm: 'basicChannelAccount:list',
      flag: false
    },
    {
      title: '推广渠道',
      icon: 'road',
      path: '/operating-center/channels',
      perm: 'basicChannel:list',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
