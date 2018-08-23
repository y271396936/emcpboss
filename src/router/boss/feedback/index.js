// 主容器
import MainContent from '@/components/common/MainContent'
// 子容器
import feedback from './feedback'

const router = {
  path: '/feedback',
  name: 'Feedback',
  component: MainContent,
  children: [
    ...feedback.routers
  ]
}

const menu = [
  feedback.menu
]

export default {
  router,
  menu
}
