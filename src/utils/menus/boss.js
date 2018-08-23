import Workflow from '@/router/boss/workflow/index'
import BrandOptimization from '@/router/boss/brand_optimization/index'
import CustomerCenter from '@/router/boss/customer_center/index'
import OperatingCenter from '@/router/boss/operating_center/index'
import ImportData from '@/router/boss/import_data/index'
import Feedback from '@/router/boss/feedback/index'
import Finance from '@/router/boss/finance/index'
import DataCenter from '@/router/boss/data/index'
import Chart from '@/router/boss/chart/index'
import CompanyInformation from '@/router/boss/company_information/index'
import SystemSetting from '@/router/boss/system_setting/index'

const navs = [
  {title: '控制面板', icon: 'desktop', menu: 'main', flag: true},
  {title: '工作流程', icon: 'tasks', menu: 'workflow', flag: false},
  {title: '品牌优化', icon: 'eye', menu: 'brandOptimization', flag: false},
  {title: '客服中心', icon: 'phone-square', menu: 'customerCenter', flag: false},
  {title: '运营中心', icon: 'beer', menu: 'operatingCenter', flag: false},
  {title: '数据导入', icon: 'sign-out', menu: 'importData', flag: false},
  {title: '留言列表', icon: 'comments', menu: 'feedback', flag: false},
  {title: '财务报表', icon: 'money', menu: 'finance', flag: false},
  {title: '数据分析', icon: 'line-chart', menu: 'data', flag: true},
  {title: '图表中心', icon: 'pie-chart', menu: 'chart', flag: false},
  {title: '公司资料', icon: 'info-circle', menu: 'companyInformation', flag: false},
  {title: '系统设置', icon: 'cogs', menu: 'systemSetting', flag: true}
]

const menus = {
  main: [],
  workflow: Workflow.menu,
  brandOptimization: BrandOptimization.menu,
  customerCenter: CustomerCenter.menu,
  operatingCenter: OperatingCenter.menu,
  importData: ImportData.menu,
  feedback: Feedback.menu,
  finance: Finance.menu,
  data: DataCenter.menu,
  chart: Chart.menu,
  companyInformation: CompanyInformation.menu,
  systemSetting: SystemSetting.menu
}

export default {
  navs,
  menus
}
