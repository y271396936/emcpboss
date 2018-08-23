const Channel = () => import(/* webpackChunkName: "page-channels" */ '@/components/operating_center/channel/Channel')
const ChannelAccount = () => import(/* webpackChunkName: "page-channels" */ '@/components/operating_center/channel/ChannelAccount')
const LoginAnalysis = () => import(/* webpackChunkName: "page-channels" */ '@/components/operating_center/channel/LoginAnalysis')

const routers = [
  {path: 'channels', component: Channel},
  {path: 'channel-accounts', component: ChannelAccount},
  {path: 'login-analysis', component: LoginAnalysis}
]

const menu = {
  title: '平台渠道',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '平台账户',
      icon: 'road',
      path: '/customer-center/channel-accounts',
      perm: 'basicChannelAccount:list',
      flag: false
    },
    {
      title: '推广渠道',
      icon: 'road',
      path: '/customer-center/channels',
      perm: 'basicChannel:list',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
