const Feedback = () => import(/* webpackChunkName: "all-operating-centers" */ '@/components/operating_center/Feedback')

const routers = [
  {path: 'feedback', component: Feedback}
]

const menu = {
  title: '留言列表',
  icon: 'comments',
  path: '/operating-center/feedback',
  perm: 'projectFeedback:list',
  flag: false
}

export default {
  routers,
  menu
}
