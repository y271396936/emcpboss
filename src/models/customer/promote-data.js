import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'date',
    title: '日期',
    type: CONDITION_TYPE.DATE,
    value: [],
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  },
  {
    name: 'itemId',
    title: '项目',
    placeholder: '--请选择项目--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: []
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.startTime = ''
    this.endTime = ''
    this.itemId = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
