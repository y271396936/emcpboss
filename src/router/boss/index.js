// 工作流程
import Workflow from './workflow/index'
// 品牌优化
import BrandOptimization from './brand_optimization/index'
// 客服中心
import CustomerCenter from './customer_center/index'
// 运营中心
import OperatingCenter from './operating_center/index'
// 数据导入
import ImportData from './import_data/index'
// 留言列表
import Feedback from '@/router/boss/feedback/index'
// 数据分析
import DataCenter from './data/index'
// 图表分析中心
import Chart from './chart/index'
// 财务报表
import Finance from './finance/index'
// 公司资料
import CompanyInformation from './company_information/index'
// 系统设置
import SystemSetting from './system_setting/index'

export default [
  Workflow.router,
  BrandOptimization.router,
  CustomerCenter.router,
  OperatingCenter.router,
  ImportData.router,
  Feedback.router,
  DataCenter.router,
  Chart.router,
  Finance.router,
  SystemSetting.router,
  CompanyInformation.router
]
