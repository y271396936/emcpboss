import { AbstractSearchArgument, AbstractFormArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '../../utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'date',
    title: '日期',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  },
  {
    name: 'customerGenre',
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
    name: 'customerTitle',
    title: '客户名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }
]

class RefundSearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.startTime = ''
    this.endTime = ''
    this.itemTitle = ''
    this.customerGenre = ''
    this.customerTitle = ''
  }
}

class RefundFormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.itemId = ''
    this.bank = ''
    this.bankCode = ''
    this.dueBank = ''
    this.money = ''
    this.refundTime = ''
    this.reason = ''
  }
}

export {
  SEARCH_CONDITION,
  RefundSearchArgument,
  RefundFormArgument
}
