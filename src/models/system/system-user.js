import { AbstractSearchArgument, AbstractFormArgument } from '../global'
import { CONDITION_TYPE } from '../../utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'loginAccount',
    title: '系统登陆账号',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.loginAccount = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.id = ''
    this.departmentId = ''
    this.roleId = ''
    this.loginAccount = ''
    this.password = ''
    this.name = ''
    this.mobile = ''
    this.qq = ''
    this.wechat = ''
    this.jobNumber = ''
    this.entryTime = ''
    this.status = ''
    this.remark = ''
    this.leaveReason = ''
    this.oldPassword = ''
    this.confirm = ''
  }
}

export {
  SEARCH_CONDITION,
  FormArgument,
  SearchArgument
}
