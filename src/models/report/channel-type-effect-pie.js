/**
 *Created by Heqi on 2018/3/17.
 */
import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

const HISTOGRAM_SEARCH_CONDITION = [
  {
    name: 'date',
    title: '日期',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.MONTH,
      format: 'yyyy-MM',
      valueFormat: 'yyyy-MM'
    }
  },
  {
    name: 'top',
    title: '排名',
    placeholder: '--请选择排名--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 5, label: '前5'},
        {value: 10, label: '前10'},
        {value: 15, label: '前15'},
        {value: 20, label: '前20'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.date = ''
    this.top = ''
  }
}

export {
  HISTOGRAM_SEARCH_CONDITION,
  SearchArgument
}
