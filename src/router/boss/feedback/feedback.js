const Feedback = () => import(/* webpackChunkName: "boss-routers" */ '@/components/operating_center/Feedback')

const routers = [
  {path: 'feedback', component: Feedback}
]

const menu = {
  title: '留言列表',
  icon: 'comments',
  path: '/feedback/feedback',
  perm: 'projectFeedback:list',
  flag: false
}

export default {
  routers,
  menu
}
