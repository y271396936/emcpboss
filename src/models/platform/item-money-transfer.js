import { AbstractSearchArgument, AbstractFormArgument } from '../global'
import { CONDITION_TYPE } from '../../utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'transferorCustomerGenre',
    title: '客户类型',
    placeholder: '--请选择客户类型--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '销售客户'},
        {value: 2, label: '渠道客户'}
      ]
    }
  },
  {
    name: 'transferorCustomerTitle',
    title: '转出客户名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'transferorItemTitle',
    title: '转出项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'transfereeItemTitle',
    title: '转入项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  }
]

class TransferSearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.transferorCustomerGenre = ''
    this.transferorCustomerTitle = ''
    this.transferorItemTitle = ''
    this.transfereeItemTitle = ''
  }
}

class TransferFormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.transferorItemId = ''
    this.transfereeItemId = ''
    this.money = ''
  }
}

export {
  SEARCH_CONDITION,
  TransferFormArgument,
  TransferSearchArgument
}
