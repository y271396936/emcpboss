import router from '@/router'
import store from '@/store'
import BossRoutes from '@/router/boss'
import CustomerRoutes from '@/router/customer'

const autoload = () => {
  // 动态添加可访问路由表
  const userInfo = store.state.user.info || {}
  const userType = userInfo['type'] || ''
  if (userType === 'boss') {
    router.addRoutes(BossRoutes)
  } else if (userType === 'customer') {
    router.addRoutes(CustomerRoutes)
  }
}

export default {
  autoload
}
