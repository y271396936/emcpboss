const CDNAccount = () => import(/* webpackChunkName: "cdn-refreshs" */ '@/components/operating_center/cdn/CDNAccount')
const CDNDomain = () => import(/* webpackChunkName: "cdn-refreshs" */ '@/components/operating_center/cdn/CDNDomainName')
const CDNRefresh = () => import(/* webpackChunkName: "cdn-refreshs" */ '@/components/operating_center/cdn/CDNRefreshLog')

const routers = [
    {path: 'cdn-account', component: CDNAccount},
    {path: 'cdn-domain', component: CDNDomain},
    {path: 'cdn-refresh', component: CDNRefresh}
]

const menu = {
  title: 'CDN 刷新管理',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: 'CDN 账号管理',
      icon: 'cloud',
      path: '/customer-center/cdn-account',
      perm: 'projectCDNAccount:list',
      flag: false
    },
    {
      title: 'CDN 域名管理',
      icon: 'bullseye',
      path: '/customer-center/cdn-domain',
      perm: 'projectCDNDomain:list',
      flag: false
    },
    {
      title: 'CDN 刷新日志',
      icon: 'refresh',
      path: '/customer-center/cdn-refresh',
      perm: 'projectCDNRefreshLog:list',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
