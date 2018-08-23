import Balance from './balance' // 余额
import Payment from './payment' // 打款记录
import Consumption from './consumption' // 消费报表
import Promotion from './promotion' // 推广管理
import Screen from './screen' // 开屏分析
import Feedback from './feedback' // 留言列表
import Setting from './setting' // 系统设置
import Industry from './industry' // 系统设置
import Entreprise from './entreprise'

export default [
  ...Balance.routers,
  ...Payment.routers,
  Consumption.router,
  ...Promotion.routers,
  Screen.router,
  ...Feedback.routers,
  ...Setting.routers,
  ...Industry.routers,
  ...Entreprise.routers
]
