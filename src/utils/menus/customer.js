const menus = [
  {
    title: '主 页',
    path: '/',
    icon: 'home'
  },
  {
    title: ' 余 额',
    path: '/balance',
    icon: 'money'
  },
  {
    title: '打款记录',
    path: '/payment',
    icon: 'credit-card'
  },
  {
    title: '消费报表',
    icon: 'table',
    sons: [
      {
        title: '消费日报',
        path: '/consumption/day',
        icon: 'tag'
      },
      {
        title: '消费月报',
        path: '/consumption/month',
        icon: 'tags'
      }
    ]
  },
  {
    title: '推广管理',
    path: '/promotion',
    icon: 'recycle'
  },
  {
    title: '开屏分析',
    path: '/screen/word',
    icon: 'codiepie'
  },
  {
    title: '留言列表',
    path: '/feedback',
    icon: 'wechat'
  },
  {
    title: '系统设置',
    path: '/setting',
    icon: 'cog'
  }
]
export default {
  menus
}
