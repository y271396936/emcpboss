import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'year',
    title: '年份',
    type: CONDITION_TYPE.DATE,
    value: new Date().getFullYear().toString(),
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.YEAR,
      format: 'yyyy',
      valueFormat: 'yyyy'
    }
  },
  {
    name: 'dataType',
    title: '数据类型',
    placeholder: '--请选择数据类型--',
    type: CONDITION_TYPE.SELECT,
    value: '总点数',
    visible: true,
    config: {
      list: [
        {value: 1, label: '总点数'},
        {value: 2, label: '总金额'}
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
    name: 'title',
    title: '项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.year = ''
    this.dataType = ''
    this.customerTitle = ''
    this.title = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
