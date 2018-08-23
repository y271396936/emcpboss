// 主容器
import MainContent from '@/components/common/MainContent'
// 子容器
import SalesDepartment from './sales-department'
import Majorization from './majorization'
import HRDepartment from './HR-department'
import Service from './service'
import BrandCenter from './brand-center'
import Development from './development'
import Finance from './finance'
import MediaDepartment from './media-department'
import OperationDepartment from './operation-department'

const router = {
  path: '/company-information',
  name: 'CompanyInformation',
  component: MainContent,
  children: [
    ...SalesDepartment.routers,
    ...Majorization.routers,
    ...HRDepartment.routers,
    ...Service.routers,
    ...BrandCenter.routers,
    ...Development.routers,
    ...Finance.routers,
    ...MediaDepartment.routers,
    ...OperationDepartment.routers
  ]
}

const menu = [
  SalesDepartment.menu,
  Majorization.menu,
  HRDepartment.menu,
  Service.menu,
  BrandCenter.menu,
  Development.menu,
  Finance.menu,
  MediaDepartment.menu,
  OperationDepartment.menu
]

export default {
  router,
  menu
}
