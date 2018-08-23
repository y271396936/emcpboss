import { AbstractSearchArgument, AbstractFormArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

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
    name: 'accountTitle',
    title: '渠道账户',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'revoke',
    title: '是否撤销',
    placeholder: '--请选择是否撤销--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 0, label: '未撤销'},
        {value: 1, label: '已撤销'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.startTime = ''
    this.endTime = ''
    this.accountTitle = ''
    this.revoke = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.revokeReason = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
