import { AbstractFormArgument, AbstractSearchArgument } from '../global'
import { CONDITION_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'customerTitle',
    title: '客户名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'loginAccount',
    title: '登陆账号',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'status',
    title: '状态',
    placeholder: '--请选择--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 0, label: '无效'},
        {value: 1, label: '有效'}
      ]
    }
  }
]
class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.customerTitle = ''
    this.loginAccount = ''
    this.status = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.customerId = ''
    this.role = ''
    this.loginAccount = ''
    this.password = ''
    this.name = ''
    this.mobile = ''
    this.systemMode = ''
    this.status = ''
    this.readStartTime = ''
    this.thumbnail = ''
  }
}

class FileFormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.category = 'photo'
    this.imgFile = ''
  }
}

class Remote {
  constructor () {
    this.customer = {
      loading: false,
      list: []
    }
    this.item = {
      loading: false,
      list: []
    }
    this.channel = {
      loading: false,
      list: []
    }
    this.industry = {
      loading: false,
      list: []
    }
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument,
  FileFormArgument,
  Remote
}
