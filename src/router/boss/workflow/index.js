// 主容器
import MainContent from '@/components/common/MainContent'
// 组件
const WorkflowIndex = () => import(/* webpackChunkName: "boss-routers" */ '@/components/workflow/Feedback')
const router = {
  path: '/workflow',
  name: 'Workflow',
  component: MainContent,
  children: [
    {path: 'index', component: WorkflowIndex}
  ]
}

const menu = [
  {title: '工作反馈', icon: 'comment', path: '/workflow/index', flag: false, perm: 'projectBidWorkFeedback:list'}
]

export default {
  router,
  menu
}
