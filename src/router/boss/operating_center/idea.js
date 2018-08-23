const IdeaList = () => import(/* webpackChunkName: "all-operating-centers" */ '@/components/operating_center/idea_manager/IdeaList')

const routers = [
  {path: 'idea-list', component: IdeaList}
]

const menu = {
  title: '创意管理',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '创意列表',
      icon: 'cloud',
      path: '/operating-center/idea-list',
      perm: 'idea:list',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
